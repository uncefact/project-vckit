# VCkit WebVH conformance

The [complete recorded run](full-run-results.md) validates VCkit against [DIF’s WebVH suite](https://github.com/decentralized-identity/didwebvh-test-suite/tree/0f03983c61ff3ed80d37239105d5b1a02e3f13dd), pinned to `0f03983c61ff3ed80d37239105d5b1a02e3f13dd`.

VCkit passes all 13 positive lifecycle scenarios, 21 negative checks across 17 scenarios, 15 self-resolution checks, and two corrupted-signature controls. Six freshly built external resolvers accept all 15 VCkit results each: **90/90 acceptance checks**. VCkit accepts all 88 available external results. Their raw JSON comparisons remain **DIFF**, not exact matches.

## Reproduce against committed vectors

From the repository root, using Node 20.12.2 and pnpm 8.14.0:

```sh
pnpm install --filter @uncefact/vckit-did-provider-webvh... --frozen-lockfile --ignore-scripts
pnpm exec tsc -b packages/did-provider-webvh
git clone https://github.com/decentralized-identity/didwebvh-test-suite.git /tmp/didwebvh-conformance
git -C /tmp/didwebvh-conformance checkout 0f03983c61ff3ed80d37239105d5b1a02e3f13dd
pnpm --filter @uncefact/vckit-did-provider-webvh test:conformance /tmp/didwebvh-conformance --output=/tmp/webvh-results
```

This mode refuses a different revision or modified vectors and leaves the suite unchanged. It writes `results.json`, `results.md`, and detailed generated fixtures to the chosen output directory. A FAIL returns a nonzero exit code; raw DIFF and upstream missing-artifact SKIP results remain visible.

## Inspect and replay the complete run

[full-run-evidence.tar.gz](full-run-evidence.tar.gz) contains the regenerated vectors, captured native resolver results, all six upstream status reports, the unmodified reports, build/runtime provenance, and the reviewed harness source. Extract it into an empty directory:

```sh
mkdir /tmp/webvh-full-evidence
tar -xzf packages/did-provider-webvh/conformance/full-run-evidence.tar.gz -C /tmp/webvh-full-evidence
node packages/did-provider-webvh/conformance/run.mjs /tmp/webvh-full-evidence --fresh --output=/tmp/webvh-replay
node packages/did-provider-webvh/conformance/audit.mjs /tmp/webvh-full-evidence /tmp/webvh-audit
```

Fresh mode verifies the suite revision, harness hashes, successful builds, image IDs, and library commits from its manifest. `audit.mjs` independently verifies that all 90 captured native results select the correct version, SCID, deactivation state, and every explicit document property. It also requires the externally tested VCkit logs and witness proofs to equal the final Linux run’s generated files. Missing or duplicate captures, native errors, changed explicit document content, and failed upstream runners fail the audit.

The report’s source digest identifies plugin sources, its package manifest, the adapter, and the assertion helper. Fixture hashes identify the actual input artifacts; the archive retains those bytes. The audit rechecks evidence, but does not itself rebuild upstream libraries.

For a new container run, use a separate suite checkout at the pinned revision and apply [record-and-verify-results.patch](patches/record-and-verify-results.patch). Build each of the suite’s six implementation Dockerfiles, record `/app/library-commit` and each image ID, and use those same images for two passes. Copy VCkit’s generated scenario directories into `vectors/<scenario>/vckit/` before the passes. Each upstream container mounts that checkout’s `vectors` and its own `implementations/<name>` directory as described by its Dockerfile. Run the final VCkit adapter with the regenerated checkout mounted read-only at `/suite` and a writable output directory at `/output`. The included [Dockerfile](Dockerfile) builds VCkit for Linux amd64 from an isolated source context; exclude credentials, `node_modules`, compiled output, and generated evidence. The archived `full-run/suite.json` documents the required fresh-run manifest structure. On this workspace, Docker builds and execution use the remote workstation.

## Harness corrections and remaining differences

The patch changes harnesses only. No resolver library is patched, and expected documents are not rewritten. It captures complete results before display normalization/truncation, enables real TypeScript Ed25519 verification instead of its permissive verifier, and treats returned resolver errors as failures. Python requests the current DID after portability and uses string historical selectors because its current resolver silently ignores integer `version_number` arguments. The original reports are retained in the archive.

All six upstream runners finish without FAIL. Java and Dart cannot generate the multiple-update-keys scenario through their current APIs, leaving two missing external artifacts; both resolve VCkit’s version successfully. Python skips five URL-only negative scenarios. VCkit evaluates all URLs in those scenarios before any HTTP fetch, so its own positive and negative coverage has no skips.

Raw differences include implicit-service IDs and endpoint trailing slashes, optional/absent/null metadata, deactivated-document representation, and historical metadata. Python’s generator records the latest version for historical requests and does not perform the domain change in its portable-move scenario. Rust’s historical `updated` metadata and some witness metadata differ. Full differing paths remain in [results.json](results.json); these are not claimed as identical output.

The pre-rotation negative without `updateKeys` is rejected, but didwebvh-ts 2.8.0 emits an internal property-access error. VCkit maps that rejection to `invalidDid`; the diagnostic remains a dependency limitation.

## Witness publication and test boundaries

The provider now supports witnessed creation, updates, witness-list changes, portability, and deactivation. Configure `witnessProofCollector` on `WebvhDIDProvider`: it receives `{ did, log, requiredWitnesses }` and returns WebVH witness proof sets. Witness transport and policy belong to the caller; the provider independently checks signatures and thresholds before publication. The previous witness list authorizes a list change. Supplying `null` to update options disables witnessing only after that approved update.

The witness migration creates a separate proof table. Verified approvals are committed and served at `did-witness.json` before the corresponding log append. A failed log write retains existing approvals and harmless pending proofs for retry. Register the exported entities and migrations; portability uses `SharedEntities` and `SharedMigrations` in the same DataSource as Veramo’s DIDStore.

The package’s 43 tests use real Veramo key management and migrated SQL.js storage, including proof-before-log HTTP publication, threshold changes, restart, rollback/retry, portability, historical selectors, and parallel did:web documents. The conformance adapter also uses real local KMS signatures. HTTP fixture responses replace external network access; these results do not verify live DNS/TLS, production reverse proxies, or a deployed witness service.
