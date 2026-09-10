# Complete WebVH validation run

Suite revision: `0f03983c61ff3ed80d37239105d5b1a02e3f13dd`. Plugin source SHA-256: `11ca5473a58e447f41ff819b1b77f6ce139a8bb4f447df6985a95cbf80f90001`.

VCkit ran on Linux amd64 with Node 20.12.2 and didwebvh-ts 2.8.0. All six upstream implementations were built and run twice. No upstream runner reported FAIL.

| VCkit check | Outcome |
| --- | --- |
| Positive creation/lifecycle scenarios, including witnesses | 13 PASS |
| Negative checks across 17 scenarios | 21 PASS |
| Self-resolution, including historical versions | 15 PASS |
| Deliberately corrupted controller/witness signatures | 2 PASS (rejected) |
| External logs resolved by VCkit | 88 accepted, 88 raw JSON DIFF |
| VCkit results checked by six external resolvers | 90 PASS |

The 90 acceptance checks require the correct selected version, SCID, deactivation state, and every explicit document property. Missing captures and native resolution errors fail the audit. This is an interoperability acceptance result, not identical JSON output across implementations.

## Upstream raw statuses

| Implementation | PASS | DIFF | FAIL | SKIP | VCkit acceptance |
| --- | ---: | ---: | ---: | ---: | ---: |
| ts | 43 | 76 | 0 | 2 | 15/15 |
| python | 38 | 90 | 0 | 5 | 15/15 |
| rust | 43 | 76 | 0 | 2 | 15/15 |
| java | 43 | 75 | 0 | 3 | 15/15 |
| java-eecc | 42 | 77 | 0 | 2 | 15/15 |
| dart | 64 | 54 | 0 | 3 | 15/15 |

Java and Dart cannot generate the multiple-update-keys scenario in their current APIs, leaving two missing external artifacts. Their resolvers both accept the VCkit version. Python skips five URL-only negative scenarios; VCkit checks every URL in those scenarios. These upstream skips remain visible.

The reviewed harness patch records full results, enables TypeScript signature verification, recognizes returned errors, and uses the current DID and string version selector for Python. It changes no resolver library or expected document. Python ignores integer version selectors; its generator also leaves the portable-move document at the original domain. The unmodified reports are retained in the evidence archive.

Raw output differences include implicit-service formatting, absent/null metadata, deactivated document representation, and historical metadata. They remain DIFFs in [results.md](results.md); none are silently converted to exact matches.

Full native results, statuses, image IDs, library commits, and evidence hashes: [full-run-results.json](full-run-results.json). Reproduction and evidence archive: [README.md](README.md).
