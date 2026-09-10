// Run the official committed vectors through the VCkit provider and resolver.
// The external suite remains read-only; generated VCkit vectors live beside this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { assertResolution } from './assert-resolution.mjs';
import { load as yaml } from 'js-yaml';
import { createAgent } from '@veramo/core';
import { DIDManager } from '@veramo/did-manager';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { DIDStore, KeyStore, PrivateKeyStore } from '@veramo/data-store';
import { DataSource } from 'typeorm';
import { bytesToMultibase, hexToBytes } from '@veramo/utils';
import { Resolver } from 'did-resolver';
import {
  WebvhDIDProvider, WebvhDidLogStore, getWebvhResolver, getWebvhLocalResolver,
  SharedEntities, SharedMigrations, VeramoSigner,
} from '../build/index.js';

const suiteCommit = '0f03983c61ff3ed80d37239105d5b1a02e3f13dd';
const here = path.dirname(fileURLToPath(import.meta.url));
const suite = process.argv[2] && path.resolve(process.argv[2]);
if (!suite) throw new Error('Usage: node conformance/run.mjs /path/to/didwebvh-test-suite');
const fresh = process.argv.includes('--fresh');
let upstreamBuilds;
let harnessManifest;
if (fresh) {
  harnessManifest = JSON.parse(fs.readFileSync(path.join(suite, 'full-run/suite.json'), 'utf8'));
  assert.equal(harnessManifest.suiteCommit, suiteCommit, 'Unexpected suite revision');
  for (const [filename, expected] of Object.entries(harnessManifest.harnessFiles)) {
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(suite, filename))).digest('hex'), expected, `Changed harness: ${filename}`);
  }
  upstreamBuilds = JSON.parse(fs.readFileSync(path.join(suite, 'full-run/builds.json'), 'utf8'));
  assert.deepEqual(upstreamBuilds.map(build => build.implementation).sort(), ['dart', 'java', 'java-eecc', 'python', 'rust', 'ts']);
  for (const build of upstreamBuilds) {
    assert.equal(build.exitCode, 0, `Unsuccessful upstream build: ${build.implementation}`);
    assert.match(build.imageId, /^sha256:[0-9a-f]{64}$/);
    assert.match(build.libraryCommit, /^[0-9a-f]{40}$/);
  }
} else {
  const actualCommit = execFileSync('git', ['-C', suite, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (actualCommit !== suiteCommit) throw new Error(`Expected suite ${suiteCommit}; found ${actualCommit}`);
  if (execFileSync('git', ['-C', suite, 'status', '--porcelain', '--', 'vectors'], { encoding: 'utf8' }).trim()) {
    throw new Error('The suite vectors have local changes; use the pinned snapshot or --fresh with a verified full-run manifest');
  }
}
const vectors = path.join(suite, 'vectors');
const outputArgument = process.argv.find(arg => arg.startsWith('--output='));
const outputDirectory = outputArgument ? path.resolve(outputArgument.slice('--output='.length)) : here;
fs.mkdirSync(outputDirectory, { recursive: true });
const generated = path.join(outputDirectory, 'generated');
fs.mkdirSync(generated, { recursive: true });
const json = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const writeJson = (filename, value) => fs.writeFileSync(filename, JSON.stringify(value, null, 2) + '\n');
const scripts = fs.readdirSync(vectors).sort().filter(name => fs.existsSync(path.join(vectors, name, 'script.yaml')))
  .map(name => ({ name, script: yaml(fs.readFileSync(path.join(vectors, name, 'script.yaml'), 'utf8')) }));
const results = { creation: [], negative: [], crossResolution: [], selfResolution: [], verifierControls: [] };
const fixtureHashes = {};
const readFixture = filename => {
  const data = fs.readFileSync(filename, 'utf8');
  fixtureHashes[path.relative(suite, filename)] = createHash('sha256').update(data).digest('hex');
  return data;
};
for (const { name } of scripts) readFixture(path.join(vectors, name, 'script.yaml'));

// A test clock keeps the DSL's timestamps deterministic, including deactivation.
// It is scoped to a single sequential operation and never changes production code.
async function atTime(timestamp, operation) {
  const OriginalDate = globalThis.Date;
  if (timestamp) globalThis.Date = class extends OriginalDate {
    constructor(...args) { super(...(args.length ? args : [timestamp])); }
    static now() { return OriginalDate.parse(timestamp); }
  };
  try { return await operation(); } finally { globalThis.Date = OriginalDate; }
}

async function fixture(witnessProofCollector) {
  const db = await new DataSource({ type: 'sqljs', entities: SharedEntities, migrations: SharedMigrations, migrationsRun: true }).initialize();
  const provider = new WebvhDIDProvider({ defaultKms: 'local', defaultPortable: false, dbConnection: db, witnessProofCollector });
  const agent = createAgent({ plugins: [
    new KeyManager({ store: new KeyStore(db), kms: { local: new KeyManagementSystem(new PrivateKeyStore(db, new SecretBox('0'.repeat(64)))) } }),
    new DIDManager({ store: new DIDStore(db), defaultProvider: 'did:webvh', providers: { 'did:webvh': provider } }),
  ] });
  const store = new WebvhDidLogStore(db);
  return { db, provider, agent, store, resolver: new Resolver(getWebvhLocalResolver(store)) };
}

async function generate(name, script) {
  const keys = {};
  const witnessKeys = new Map();
  const { db, provider, agent, store, resolver } = await fixture(async request => {
    const entry = request.log.at(-1);
    const proof = await Promise.all(request.requiredWitnesses.witnesses.map(async ({ id }) => {
      const key = witnessKeys.get(id);
      assert.ok(key, `Unknown witness ${id}`);
      const multikey = id.slice('did:key:'.length);
      const signer = new VeramoSigner(key.kid, `${id}#${multikey}`, { agent });
      const template = { type: 'DataIntegrityProof', cryptosuite: 'eddsa-jcs-2022',
        proofPurpose: 'assertionMethod', verificationMethod: signer.getVerificationMethodId(), created: entry.versionTime };
      return { ...template, ...await signer.sign({ document: { versionId: entry.versionId }, proof: template }) };
    }));
    return [{ versionId: entry.versionId, proof }];
  });
  try {
    for (const key of script.keys) {
      assert.equal(key.type, 'ed25519');
      keys[key.id] = await agent.keyManagerImport({ kms: 'local', type: 'Ed25519', privateKeyHex: key.seed });
      witnessKeys.set('did:key:' + bytesToMultibase(hexToBytes(keys[key.id].publicKeyHex), 'Ed25519'), keys[key.id]);
    }
    const refs = names => names?.map(name => { assert.ok(keys[name], `Unknown key ${name}`); return keys[name].kid; });
    const witnessConfig = config => config && ({ threshold: config.threshold,
      witnesses: config.witnesses.map(({ id }) => ({ id: 'did:key:' + bytesToMultibase(hexToBytes(keys[id].publicKeyHex), 'Ed25519') })) });
    const dir = path.join(generated, name);
    fs.mkdirSync(dir, { recursive: true });
    let identifier;
    for (const step of script.steps) {
      await atTime(step.timestamp, async () => {
        const params = step.params ?? {};
        if (step.op === 'create') {
          identifier = await agent.didManagerCreate({ options: {
            domain: step.domain, portable: params.portable ?? false,
            updateKeys: refs(params.updateKeys ?? [step.signer]), signingKey: keys[step.signer].kid,
            nextUpdateKeys: refs(params.nextKeyHashes), services: params.services, witnesses: witnessConfig(params.witness),
          } });
        } else if (step.op === 'update') {
          identifier = await agent.didManagerUpdate({ did: identifier.did, document: {
            service: params.services, alsoKnownAs: params.alsoKnownAs,
          }, options: {
            signingKey: keys[step.signer].kid, updateKeys: refs(params.updateKeys),
            nextUpdateKeys: refs(params.nextKeyHashes ?? []), portToDomain: step.domain, witnesses: witnessConfig(params.witness),
          } });
        } else if (step.op === 'deactivate') {
          await provider.deleteIdentifier(identifier, { agent });
        } else if (step.op === 'resolve') {
          const result = await resolver.resolve(identifier.did, {
            ...(step.versionNumber !== undefined ? { versionNumber: step.versionNumber } : {}),
            ...(step.versionId !== undefined ? { versionId: step.versionId } : {}),
          });
          assert.equal(result.didResolutionMetadata.error, undefined, JSON.stringify(result.didResolutionMetadata));
          if (result.didDocumentMetadata.deactivated) assert.equal(result.didDocument, null);
          else assert.equal(result.didDocument?.id, identifier.did);
          if (step.versionNumber !== undefined) assert.ok(result.didDocumentMetadata.versionId.startsWith(step.versionNumber + '-'));
          writeJson(path.join(dir, step.expect), result);
        } else throw new Error(`Unsupported positive DSL operation ${step.op}`);
      });
    }
    const log = await store.getLogForDid(identifier.did);
    const witnessProofs = await store.getWitnessProofsForDid(identifier.did);
    if (witnessProofs.length) writeJson(path.join(dir, 'did-witness.json'), witnessProofs);
    fs.writeFileSync(path.join(dir, 'did.jsonl'), log.map(entry => JSON.stringify(entry)).join('\n') + '\n');
    return { scenario: name, status: 'PASS', entries: log.length };
  } catch (error) {
    return { scenario: name, status: 'FAIL', reason: error.message };
  } finally { await db.destroy(); }
}

// Route only fixture HTTP responses into the public VCkit network resolver. All
// signature, SCID, chain, witness, and parameter validation remains enabled.
async function resolveFixture(logText, witnessText, options = {}, requestedDid) {
  const log = logText.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
  const did = requestedDid ?? log[0].state.id;
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  const fetches = [];
  globalThis.fetch = async url => {
    const address = String(url);
    fetches.push(address);
    if (!log.length) throw new Error('Unexpected network access for a URL-only negative vector');
    if (address.endsWith('/did.jsonl')) return new Response(logText, { status: 200 });
    if (address.endsWith('/did-witness.json')) return new Response(witnessText ?? '[]', { status: 200 });
    throw new Error(`Unexpected fixture request: ${address}`);
  };
  // The dependency logs returned validation errors; capture them in structured results.
  console.error = () => {};
  try { return { result: await new Resolver(getWebvhResolver()).resolve(did, options), fetches }; }
  finally { globalThis.fetch = originalFetch; console.error = originalError; }
}

// Compare JSON values without rewriting documents or metadata. Object member
// order is irrelevant; arrays, values, property names, and presence are preserved.
function differingPaths(expected, actual, prefix = '') {
  if (JSON.stringify(expected) === JSON.stringify(actual)) return [];
  if (expected && actual && typeof expected === 'object' && typeof actual === 'object' && Array.isArray(expected) === Array.isArray(actual)) {
    return [...new Set([...Object.keys(expected), ...Object.keys(actual)])].flatMap(key =>
      differingPaths(expected[key], actual[key], `${prefix}/${key}`));
  }
  return [prefix || '/'];
}

async function compareDirectory(scenario, source, dir, isExternal) {
  const read = filename => isExternal ? readFixture(filename) : fs.readFileSync(filename, 'utf8');
  const logPath = path.join(dir, 'did.jsonl');
  if (!fs.existsSync(logPath)) return [{ scenario, source, status: 'SKIP', reason: 'No committed log' }];
  const log = read(logPath);
  const witnessPath = path.join(dir, 'did-witness.json');
  const witnesses = fs.existsSync(witnessPath) ? read(witnessPath) : undefined;
  const expectedFiles = fs.readdirSync(dir).filter(file => /^resolutionResult(?:\.\d+)?\.json$/.test(file)).sort();
  if (!expectedFiles.length) return [{ scenario, source, status: 'SKIP', reason: 'No committed resolution output' }];
  const rows = [];
  for (const file of expectedFiles) {
    const expected = JSON.parse(read(path.join(dir, file)));
    const version = /^resolutionResult\.(\d+)\.json$/.exec(file)?.[1];
    try {
      const { result: actual } = await resolveFixture(log, witnesses, version ? { versionNumber: Number(version) } : {});
      assertResolution(actual, log.trim().split('\n').map(line => JSON.parse(line)), file);
      const differences = differingPaths(expected, JSON.parse(JSON.stringify(actual)));
      const error = actual.didResolutionMetadata.error;
      rows.push({ scenario, source, file, status: error ? 'FAIL' : differences.length ? 'DIFF' : 'PASS',
        ...(error ? { reason: actual.didResolutionMetadata.message ?? error, error } : differences.length ? { differences } : {}) });
      writeJson(path.join(generated, `${scenario}-${source}-${file}`), { expected, actual });
    } catch (error) { rows.push({ scenario, source, file, status: 'FAIL', reason: error.message }); }
  }
  return rows;
}

for (const { name, script } of scripts.filter(({ script }) => !script.negative)) {
  const row = await generate(name, script);
  results.creation.push(row);
  process.stdout.write(`Create ${name}: ${row.status}${row.reason ? ' - ' + row.reason : ''}\n`);
  if (row.status === 'PASS') results.selfResolution.push(...await compareDirectory(name, 'vckit', path.join(generated, name), false));
}
for (const { name, script } of scripts.filter(({ script }) => script.negative)) {
  const urlSteps = script.steps.filter(step => step.op === 'resolve-did');
  if (urlSteps.length) {
    for (const step of urlSteps) {
      const { result, fetches } = await resolveFixture('', undefined, {}, step.did);
      results.negative.push({ scenario: name, input: step.did, expectedError: step.expectError,
        status: result.didResolutionMetadata.error && !fetches.length ? 'PASS' : 'FAIL',
        error: result.didResolutionMetadata.error, fetches });
    }
  } else {
    // Match the official harness's negative baseline: the committed ts artifacts.
    const dir = path.join(vectors, name, 'ts');
    const logPath = path.join(dir, 'did.jsonl');
    if (!fs.existsSync(logPath)) { results.negative.push({ scenario: name, status: 'SKIP', reason: 'No negative artifact' }); continue; }
    const witnessPath = path.join(dir, 'did-witness.json');
    const { result } = await resolveFixture(readFixture(logPath), fs.existsSync(witnessPath) ? readFixture(witnessPath) : undefined);
    results.negative.push({ scenario: name, expectedError: script.steps.findLast(step => step.expectError)?.expectError,
      status: result.didResolutionMetadata.error ? 'PASS' : 'FAIL', error: result.didResolutionMetadata.error,
      reason: result.didResolutionMetadata.message ?? 'Invalid log was accepted' });
  }
}
for (const { name, script } of scripts.filter(({ script }) => !script.negative)) {
  const dir = path.join(vectors, name);
  for (const source of fs.readdirSync(dir).filter(source => source !== 'vckit' && fs.statSync(path.join(dir, source)).isDirectory()).sort()) {
    results.crossResolution.push(...await compareDirectory(name, source, path.join(dir, source), true));
  }
  process.stdout.write(`Cross-resolved ${name}\n`);
}
// Negative controls establish that the adapter really checks controller and witness
// signatures, rather than just accepting correctly structured fixture proofs.
for (const [name, witness] of [['basic-create', false], ['witness-threshold', true]]) {
  const dir = path.join(vectors, name, 'ts');
  const log = readFixture(path.join(dir, 'did.jsonl')).trim().split('\n').map(line => JSON.parse(line));
  const proofs = witness ? JSON.parse(readFixture(path.join(dir, 'did-witness.json'))) : undefined;
  const targets = witness ? proofs.flatMap(entry => entry.proof) : log.flatMap(entry => entry.proof);
  for (const proof of targets) proof.proofValue = proof.proofValue.slice(0, -1) + (proof.proofValue.endsWith('1') ? '2' : '1');
  const { result } = await resolveFixture(log.map(entry => JSON.stringify(entry)).join('\n'), proofs && JSON.stringify(proofs));
  results.verifierControls.push({ scenario: witness ? 'corrupt-witness-signature' : 'corrupt-controller-signature',
    status: result.didResolutionMetadata.error ? 'PASS' : 'FAIL', reason: result.didResolutionMetadata.message });
}
const count = rows => rows.reduce((counts, row) => ({ ...counts, [row.status]: (counts[row.status] ?? 0) + 1 }), {});
const summary = Object.fromEntries(Object.entries(results).map(([key, rows]) => [key, count(rows)]));
function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry =>
    entry.isDirectory() ? sourceFiles(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
const sourceHash = createHash('sha256');
for (const file of [...sourceFiles(path.join(here, '../src')), path.join(here, '../package.json'), fileURLToPath(import.meta.url), path.join(here, 'assert-resolution.mjs')]) {
  sourceHash.update(path.relative(path.join(here, '..'), file)).update('\0').update(fs.readFileSync(file));
}
const report = { suite: 'https://github.com/decentralized-identity/didwebvh-test-suite', suiteCommit, node: process.version,
  platform: process.platform, architecture: process.arch,
  dependency: json(path.join(here, '../package.json')).dependencies['didwebvh-ts'],
  mode: fresh ? 'regenerated' : 'committed', ...(fresh ? { upstreamBuilds, harnessManifest } : {}),
  sourceSha256: sourceHash.digest('hex'), generatedAt: new Date().toISOString(), summary, results, fixtureHashes };
writeJson(path.join(outputDirectory, 'results.json'), report);
const lines = ['# WebVH conformance results', '', `Suite: [didwebvh-test-suite](${report.suite}/tree/${suiteCommit}) at \`${suiteCommit}\`.`, '',
  `Runtime: Node ${report.node}; didwebvh-ts ${report.dependency}. Generated ${report.generatedAt}.`, '',
  'The adapter uses VCkit with a real Veramo local KMS and a migrated SQL.js database. Network resolution receives HTTP fixtures; cryptographic verification remains enabled.', '',
  fresh ? 'All six external implementations were rebuilt and run twice in owned Linux containers; this run consumes their regenerated artifacts. The full-run manifest records image IDs, library commits, and the reviewed harness changes.' : 'This run consumes the suite’s committed artifacts. It does not rebuild other implementations.', '',
  '| Stage | PASS | DIFF | FAIL | SKIP |', '| --- | ---: | ---: | ---: | ---: |',
  ...Object.entries(summary).map(([stage, counts]) => `| ${stage} | ${counts.PASS ?? 0} | ${counts.DIFF ?? 0} | ${counts.FAIL ?? 0} | ${counts.SKIP ?? 0} |`), '',
  'A DIFF means successful resolution with the correct selected version and explicit document state, but different result JSON. Negative PASS means rejection, not necessarily an identical error code. URL-only negatives also require rejection before any fetch. Witness-enabled creation, updates, proof publication, and external witness resolution are verified. External SKIPs identify missing upstream artifacts; VCkit creation has no skips.', '',
  '## Non-passing results', '', '| Stage / scenario / source | Result | Detail |', '| --- | --- | --- |'];
for (const [stage, rows] of Object.entries(results)) for (const row of rows.filter(row => row.status !== 'PASS')) {
  lines.push(`| ${stage} / ${row.scenario}${row.source ? ' / ' + row.source : ''}${row.file ? ' / ' + row.file : ''} | ${row.status} | ${(row.reason ?? row.differences?.join(', ') ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ')} |`);
}
lines.push('', 'Full results and fixture SHA-256 hashes: [results.json](results.json). Rerun instructions and limitations: [README.md](README.md).', '');
fs.writeFileSync(path.join(outputDirectory, 'results.md'), lines.join('\n'));
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
process.exitCode = Object.values(results).some(rows => rows.some(row => row.status === 'FAIL')) ? 1 : 0;
