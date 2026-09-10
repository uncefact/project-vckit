// Audit captured native resolver results, without rewriting raw suite outcomes.
// Usage: node conformance/audit.mjs /path/to/fresh-suite /path/to/output
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { assertResolution } from './assert-resolution.mjs';

const suite = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3]);
const evidenceHashes = {};
const read = relative => {
  const bytes = fs.readFileSync(path.join(suite, relative));
  evidenceHashes[relative] = createHash('sha256').update(bytes).digest('hex');
  return bytes.toString('utf8');
};
const json = relative => JSON.parse(read(relative));
const implementations = ['ts', 'python', 'rust', 'java', 'java-eecc', 'dart'];
const vckit = json('full-run/vckit-linux/results.json');
assert.equal(vckit.platform, 'linux');
assert.equal(vckit.architecture, 'x64');
assert.deepEqual(vckit.summary.creation, { PASS: 13 });
assert.deepEqual(vckit.summary.negative, { PASS: 21 });
assert.deepEqual(vckit.summary.selfResolution, { PASS: 15 });
assert.deepEqual(vckit.summary.verifierControls, { PASS: 2 });
assert.deepEqual(vckit.summary.crossResolution, { DIFF: 88, SKIP: 2 });
const manifest = json('full-run/suite.json');
assert.deepEqual(manifest, vckit.harnessManifest);
for (const [file, expected] of Object.entries(manifest.harnessFiles)) {
  read(file);
  assert.equal(evidenceHashes[file], expected, `Changed harness ${file}`);
}
const passes = ['final-pass1', 'final-pass2'].map(phase => json(`full-run/${phase}.json`));
for (const pass of passes) {
  assert.deepEqual(pass.map(row => row.implementation), implementations);
  for (const row of pass) {
    assert.equal(row.exitCode, 0);
    assert.equal(row.statusPresent, true);
  }
}
const cases = vckit.results.selfResolution;
assert.equal(new Set(cases.map(row => `${row.scenario}/${row.file}`)).size, 15);
const rows = [];
const upstream = [];
for (const implementation of implementations) {
  const rawStatus = read(`implementations/${implementation}/status.md`);
  const rawCounts = Object.fromEntries(['PASS', 'DIFF', 'FAIL', 'SKIP'].map(status => [status,
    rawStatus.split('\n').filter(line => line.startsWith('| ') && line.includes(status)).length]));
  assert.equal(rawCounts.FAIL, 0, `${implementation} reports a failure`);
  upstream.push({ implementation, rawCounts, rawStatus });
  const captured = read(`implementations/${implementation}/actual-results.jsonl`).trim().split('\n').map(JSON.parse)
    .filter(row => row.source === 'vckit');
  assert.equal(captured.length, 15, `Missing/extra ${implementation} captures`);
  for (const test of cases) {
    const matching = captured.filter(row => row.scenario === test.scenario && row.file === test.file);
    assert.equal(matching.length, 1, `Missing/duplicate ${implementation}/${test.scenario}/${test.file}`);
    const capture = matching[0];
    const relativeLog = `vectors/${test.scenario}/vckit/did.jsonl`;
    const log = read(relativeLog).trim().split('\n').map(JSON.parse);
    // The external implementations must have tested the same VCkit logs that
    // the final Linux run generated from the official seeds and timestamps.
    assert.equal(read(`full-run/vckit-linux/generated/${test.scenario}/did.jsonl`), read(relativeLog));
    if (test.scenario.startsWith('witness-')) {
      assert.equal(read(`full-run/vckit-linux/generated/${test.scenario}/did-witness.json`),
        read(`vectors/${test.scenario}/vckit/did-witness.json`));
    }
    assertResolution(capture.actual, log, test.file, capture.nativeDocumentPresent);
    rows.push({ implementation, scenario: test.scenario, file: test.file, status: 'PASS',
      versionId: capture.actual.didDocumentMetadata.versionId,
      nativeDocumentPresent: capture.nativeDocumentPresent,
      actual: capture.actual });
  }
}
const report = { generatedAt: new Date().toISOString(), suiteCommit: vckit.suiteCommit,
  sourceSha256: vckit.sourceSha256, vckitImage: json('full-run/vckit-image.json'),
  upstreamBuilds: vckit.upstreamBuilds, harnessManifest: manifest, passes,
  vckitSummary: vckit.summary, externalAcceptance: { PASS: rows.length, FAIL: 0 },
  upstream, rows, evidenceHashes };
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'full-run-results.json'), JSON.stringify(report, null, 2) + '\n');
const lines = ['# Complete WebVH validation run', '',
  `Suite revision: \`${report.suiteCommit}\`. Plugin source SHA-256: \`${report.sourceSha256}\`.`, '',
  'VCkit ran on Linux amd64 with Node 20.12.2 and didwebvh-ts 2.8.0. All six upstream implementations were built and run twice. No upstream runner reported FAIL.', '',
  '| VCkit check | Outcome |', '| --- | --- |',
  '| Positive creation/lifecycle scenarios, including witnesses | 13 PASS |',
  '| Negative checks across 17 scenarios | 21 PASS |',
  '| Self-resolution, including historical versions | 15 PASS |',
  '| Deliberately corrupted controller/witness signatures | 2 PASS (rejected) |',
  '| External logs resolved by VCkit | 88 accepted, 88 raw JSON DIFF |',
  '| VCkit results checked by six external resolvers | 90 PASS |', '',
  'The 90 acceptance checks require the correct selected version, SCID, deactivation state, and every explicit document property. Missing captures and native resolution errors fail the audit. This is an interoperability acceptance result, not identical JSON output across implementations.', '',
  '## Upstream raw statuses', '',
  '| Implementation | PASS | DIFF | FAIL | SKIP | VCkit acceptance |', '| --- | ---: | ---: | ---: | ---: | ---: |',
  ...upstream.map(({ implementation, rawCounts: c }) => `| ${implementation} | ${c.PASS} | ${c.DIFF} | ${c.FAIL} | ${c.SKIP} | 15/15 |`), '',
  'Java and Dart cannot generate the multiple-update-keys scenario in their current APIs, leaving two missing external artifacts. Their resolvers both accept the VCkit version. Python skips five URL-only negative scenarios; VCkit checks every URL in those scenarios. These upstream skips remain visible.', '',
  'The reviewed harness patch records full results, enables TypeScript signature verification, recognizes returned errors, and uses the current DID and string version selector for Python. It changes no resolver library or expected document. Python ignores integer version selectors; its generator also leaves the portable-move document at the original domain. The unmodified reports are retained in the evidence archive.', '',
  'Raw output differences include implicit-service formatting, absent/null metadata, deactivated document representation, and historical metadata. They remain DIFFs in [results.md](results.md); none are silently converted to exact matches.', '',
  'Full native results, statuses, image IDs, library commits, and evidence hashes: [full-run-results.json](full-run-results.json). Reproduction and evidence archive: [README.md](README.md).', ''];
fs.writeFileSync(path.join(output, 'full-run-results.md'), lines.join('\n'));
console.log(JSON.stringify(report.externalAcceptance));
