# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.10](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2024-09-27)


### Features

* bitstring status list issue with enveloping proof ([#216](https://github.com/uncefact/project-vckit/issues/216)) ([2527fdb](https://github.com/uncefact/project-vckit/commit/2527fdb06c2b623911b8d8e4f83650208abbab21)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)





# [1.0.0-beta.9](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2024-09-24)

### Bug Fixes

- adjust bitstring status list model ([#214](https://github.com/uncefact/project-vckit/issues/214)) ([0f2b1c9](https://github.com/uncefact/project-vckit/commit/0f2b1c9f1ea6e5cdb3ec3109e97eb47a730d0d70)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)

### Features

- implement authenticate for vc api ([#215](https://github.com/uncefact/project-vckit/issues/215)) ([9b08b2c](https://github.com/uncefact/project-vckit/commit/9b08b2c4014da72cd97a67a7a22170614e6331ba)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)

# [1.0.0-beta.8](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.8) (2024-09-19)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add interface for compute hash ([#179](https://github.com/uncefact/project-vckit/issues/179)) ([bc78c32](https://github.com/uncefact/project-vckit/commit/bc78c32e3c303d48168655c0dba1a888586a58ac)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- bug fix for dockerize ([#174](https://github.com/uncefact/project-vckit/issues/174)) ([7422328](https://github.com/uncefact/project-vckit/commit/74223283c09b1e9d1b8b49ab5e0f841f51a05f9d)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
- handle supportedProofFormats optional for revocation list ([950891e](https://github.com/uncefact/project-vckit/commit/950891eedbd68cb529513ba0ffb10e6e584bf7b5))
- minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- Provide meaningful error message when signature verification fails ([#197](https://github.com/uncefact/project-vckit/issues/197)) ([b6b18c6](https://github.com/uncefact/project-vckit/commit/b6b18c68e873fb0825b0605023ed81a302d5f356)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
- update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- using revocation list on explorer and handle no hash ([#192](https://github.com/uncefact/project-vckit/issues/192)) ([95ba80e](https://github.com/uncefact/project-vckit/commit/95ba80eb2bb61cf97f1ef0b06357937165ab48f1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)

### Features

- Add `eddsa-rdfc-2022-cryptosuite` Plugin ([#200](https://github.com/uncefact/project-vckit/issues/200)) ([d651176](https://github.com/uncefact/project-vckit/commit/d651176bd852514cfda37d9098e84663d1ac9be2)), closes [vckit/credential-data-integrity#VCkitEddsaRdfc2022](https://github.com/vckit/credential-data-integrity/issues/VCkitEddsaRdfc2022)
- add compute hash utils ([#175](https://github.com/uncefact/project-vckit/issues/175)) ([6eb5802](https://github.com/uncefact/project-vckit/commit/6eb5802658bddd74e0d2fbb6225421a7394a4834)), closes [/w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023](https://github.com//w3c-ccg.github.io/vc-render-method//issues/svgrenderingtemplate2023) [/w3c-ccg.github.io/multibase/#tv-base58](https://github.com//w3c-ccg.github.io/multibase//issues/tv-base58) [#123](https://github.com/uncefact/project-vckit/issues/123)
- adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- bitstring status list entry ([0d1149f](https://github.com/uncefact/project-vckit/commit/0d1149f048f8e853bfd6bda4b0c99871ef76d8ed))
- **cd:** ghcr.io setup and docker image build workflow ([#206](https://github.com/uncefact/project-vckit/issues/206)) ([3c359dc](https://github.com/uncefact/project-vckit/commit/3c359dc9f28421dba3d3b26d6fe3bbde5b549c4c)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- create git workflow for release tagging and generate the release note ([#199](https://github.com/uncefact/project-vckit/issues/199)) ([8deaa53](https://github.com/uncefact/project-vckit/commit/8deaa533dec67db55af7c70bfbdb96565442fd0f))
- credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
- dockerise vckit api ([#168](https://github.com/uncefact/project-vckit/issues/168)) ([2d3609b](https://github.com/uncefact/project-vckit/commit/2d3609b4e4b1c4ce4f82ac4ecbfc60b7bd17b446)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- enhance credentials page for demo explorer package ([#161](https://github.com/uncefact/project-vckit/issues/161)) ([2e61b8f](https://github.com/uncefact/project-vckit/commit/2e61b8fb8f09cd2298c464341f7bb8d496b60dc0)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- enveloping proof ([#207](https://github.com/uncefact/project-vckit/issues/207)) ([998356b](https://github.com/uncefact/project-vckit/commit/998356b0823610f95b557910a3bcb04567f25a15)), closes [3332/credentials/status/bitstring-status-list/5#0](https://github.com/3332/credentials/status/bitstring-status-list/5/issues/0) [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
- implement merkle disclosure proof 2021 ([#157](https://github.com/uncefact/project-vckit/issues/157)) ([6c7d2ed](https://github.com/uncefact/project-vckit/commit/6c7d2edbf65a7c3aa0b84e8faaf0da3a36de268f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer 2024 provider ([#177](https://github.com/uncefact/project-vckit/issues/177)) ([7bcbde3](https://github.com/uncefact/project-vckit/commit/7bcbde3b8f32cd85d94873799938df4cbc4098b4))
- implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
- implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement vc api v2 in open api ([#178](https://github.com/uncefact/project-vckit/issues/178)) ([db8b185](https://github.com/uncefact/project-vckit/commit/db8b1858b62b7e307052ad870ee43c96dcbbb439)), closes [function#V1](https://github.com/function/issues/V1) [function#V2](https://github.com/function/issues/V2) [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
- include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
- react components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- setup package workflow ([2e22d72](https://github.com/uncefact/project-vckit/commit/2e22d72a9d8d594d8d649d34b312166a82e5ed5b))
- vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)

# [1.0.0-beta.8](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.8) (2024-09-19)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add interface for compute hash ([#179](https://github.com/uncefact/project-vckit/issues/179)) ([bc78c32](https://github.com/uncefact/project-vckit/commit/bc78c32e3c303d48168655c0dba1a888586a58ac)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- bug fix for dockerize ([#174](https://github.com/uncefact/project-vckit/issues/174)) ([7422328](https://github.com/uncefact/project-vckit/commit/74223283c09b1e9d1b8b49ab5e0f841f51a05f9d)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
- handle supportedProofFormats optional for revocation list ([950891e](https://github.com/uncefact/project-vckit/commit/950891eedbd68cb529513ba0ffb10e6e584bf7b5))
- minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- Provide meaningful error message when signature verification fails ([#197](https://github.com/uncefact/project-vckit/issues/197)) ([b6b18c6](https://github.com/uncefact/project-vckit/commit/b6b18c68e873fb0825b0605023ed81a302d5f356)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
- update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- using revocation list on explorer and handle no hash ([#192](https://github.com/uncefact/project-vckit/issues/192)) ([95ba80e](https://github.com/uncefact/project-vckit/commit/95ba80eb2bb61cf97f1ef0b06357937165ab48f1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)

### Features

- Add `eddsa-rdfc-2022-cryptosuite` Plugin ([#200](https://github.com/uncefact/project-vckit/issues/200)) ([d651176](https://github.com/uncefact/project-vckit/commit/d651176bd852514cfda37d9098e84663d1ac9be2)), closes [vckit/credential-data-integrity#VCkitEddsaRdfc2022](https://github.com/vckit/credential-data-integrity/issues/VCkitEddsaRdfc2022)
- add compute hash utils ([#175](https://github.com/uncefact/project-vckit/issues/175)) ([6eb5802](https://github.com/uncefact/project-vckit/commit/6eb5802658bddd74e0d2fbb6225421a7394a4834)), closes [/w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023](https://github.com//w3c-ccg.github.io/vc-render-method//issues/svgrenderingtemplate2023) [/w3c-ccg.github.io/multibase/#tv-base58](https://github.com//w3c-ccg.github.io/multibase//issues/tv-base58) [#123](https://github.com/uncefact/project-vckit/issues/123)
- adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- bitstring status list entry ([0d1149f](https://github.com/uncefact/project-vckit/commit/0d1149f048f8e853bfd6bda4b0c99871ef76d8ed))
- **cd:** ghcr.io setup and docker image build workflow ([#206](https://github.com/uncefact/project-vckit/issues/206)) ([3c359dc](https://github.com/uncefact/project-vckit/commit/3c359dc9f28421dba3d3b26d6fe3bbde5b549c4c)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- create git workflow for release tagging and generate the release note ([#199](https://github.com/uncefact/project-vckit/issues/199)) ([8deaa53](https://github.com/uncefact/project-vckit/commit/8deaa533dec67db55af7c70bfbdb96565442fd0f))
- credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
- dockerise vckit api ([#168](https://github.com/uncefact/project-vckit/issues/168)) ([2d3609b](https://github.com/uncefact/project-vckit/commit/2d3609b4e4b1c4ce4f82ac4ecbfc60b7bd17b446)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- enhance credentials page for demo explorer package ([#161](https://github.com/uncefact/project-vckit/issues/161)) ([2e61b8f](https://github.com/uncefact/project-vckit/commit/2e61b8fb8f09cd2298c464341f7bb8d496b60dc0)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- enveloping proof ([#207](https://github.com/uncefact/project-vckit/issues/207)) ([998356b](https://github.com/uncefact/project-vckit/commit/998356b0823610f95b557910a3bcb04567f25a15)), closes [3332/credentials/status/bitstring-status-list/5#0](https://github.com/3332/credentials/status/bitstring-status-list/5/issues/0) [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
- implement merkle disclosure proof 2021 ([#157](https://github.com/uncefact/project-vckit/issues/157)) ([6c7d2ed](https://github.com/uncefact/project-vckit/commit/6c7d2edbf65a7c3aa0b84e8faaf0da3a36de268f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer 2024 provider ([#177](https://github.com/uncefact/project-vckit/issues/177)) ([7bcbde3](https://github.com/uncefact/project-vckit/commit/7bcbde3b8f32cd85d94873799938df4cbc4098b4))
- implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
- implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement vc api v2 in open api ([#178](https://github.com/uncefact/project-vckit/issues/178)) ([db8b185](https://github.com/uncefact/project-vckit/commit/db8b1858b62b7e307052ad870ee43c96dcbbb439)), closes [function#V1](https://github.com/function/issues/V1) [function#V2](https://github.com/function/issues/V2) [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
- include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
- react components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- setup package workflow ([2e22d72](https://github.com/uncefact/project-vckit/commit/2e22d72a9d8d594d8d649d34b312166a82e5ed5b))
- vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)

# [1.0.0-beta.7](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.7) (2023-10-11)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
- minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
- update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)

### Features

- adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
- implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
- implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
- implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
- include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
- react components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)

# [1.0.0-beta.6](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.6) (2023-10-09)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
- minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
- update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)

### Features

- adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
- implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
- implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
- implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
- include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
- react components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)

# [1.0.0-beta.5](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.5) (2023-06-22)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))

### Features

- adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
- implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
- implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
- vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)

# [1.0.0-beta.4](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2023-06-04)

### Features

- adds traceability interop default context ([f3783f0](https://github.com/uncefact/project-vckit/commit/f3783f09cfd9cc9aa55591b98d5ce3e92b1575be))

# [1.0.0-beta.3](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2023-06-02)

**Note:** Version bump only for package vckit

# [1.0.0-beta.2](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2023-05-11)

### Features

- add aunauthenticated qrcode route ([e72acdf](https://github.com/uncefact/project-vckit/commit/e72acdfff034ef414bb4f385e039979da623cf1e))

# [1.0.0-beta.1](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2023-05-10)

**Note:** Version bump only for package vckit

# [1.0.0-beta.0](https://github.com/uncefact/project-vckit/compare/v0.3.0...v1.0.0-beta.0) (2023-05-09)

### Features

- add traceability interop example documents ([5ef4191](https://github.com/uncefact/project-vckit/commit/5ef41918e772ebe4e94715c3f884e0872a27caeb))

# [0.3.0](https://github.com/uncefact/project-vckit/compare/v0.2.2...v0.3.0) (2023-05-05)

### Bug Fixes

- correct doc path and get rapidoc from cdn ([e456506](https://github.com/uncefact/project-vckit/commit/e4565069df409033f350a6faf57ebf11480aeaea))
- correct path and agent method call in router ([4dac60e](https://github.com/uncefact/project-vckit/commit/4dac60e755e71f0081d916f1b993ba865686d4f0))
- temp hardcode appwrite client ([b25cb9a](https://github.com/uncefact/project-vckit/commit/b25cb9ab5bd8fdb5195e2a4b16e87a4d2458303e))

### Features

- add wallet app to default config ([0372201](https://github.com/uncefact/project-vckit/commit/0372201cf40bd1b0bee41f187bfccaada8694c38))
- **app:** enable view identifiers, credentials, messages ([c1a8ace](https://github.com/uncefact/project-vckit/commit/c1a8aced242b2631fe1999902b23e6f0844ad9a6))
- init base cli ([9dd38c7](https://github.com/uncefact/project-vckit/commit/9dd38c718d5356a88d1843ba8fe79f44dbb9bc67))
- partial implementation of creadentials/issue ([3872204](https://github.com/uncefact/project-vckit/commit/387220457fd1f7aa36cf938bd613a1b329c8cb3b))
- partial implementation of get /credentials ([6a0cca9](https://github.com/uncefact/project-vckit/commit/6a0cca916703ecfb6674f12653390b26a13efbbd))
- partial implementation of identifiers/{did} ([e47ea92](https://github.com/uncefact/project-vckit/commit/e47ea9247374c96afde58a754f69fe68045d2b26))
- restructure types and add OA types ([5c1ac47](https://github.com/uncefact/project-vckit/commit/5c1ac471939fa4aa94ad20999f7455a6543f109a))

## [1.0.0](https://github.com/uncefact/project-vckit/compare/v1.0.0...v1.0.0) (2025-01-03)


### Features

* Add `eddsa-rdfc-2022-cryptosuite` Plugin ([#200](https://github.com/uncefact/project-vckit/issues/200)) ([d651176](https://github.com/uncefact/project-vckit/commit/d651176bd852514cfda37d9098e84663d1ac9be2))
* Add aunauthenticated qrcode route ([e72acdf](https://github.com/uncefact/project-vckit/commit/e72acdfff034ef414bb4f385e039979da623cf1e))
* Add compute hash utils ([#175](https://github.com/uncefact/project-vckit/issues/175)) ([6eb5802](https://github.com/uncefact/project-vckit/commit/6eb5802658bddd74e0d2fbb6225421a7394a4834))
* Add traceability interop example documents ([5af7aa9](https://github.com/uncefact/project-vckit/commit/5af7aa9fd611a2a359f0ebf4bc638d8b4a090f30))
* Adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
* **agent:** Initialise agent library ([#3](https://github.com/uncefact/project-vckit/issues/3)) ([e5fa0ad](https://github.com/uncefact/project-vckit/commit/e5fa0adac88efefd2f100fd8dc7230758fcae078))
* **app:** Enable view identifiers, credentials, messages ([16cd241](https://github.com/uncefact/project-vckit/commit/16cd241cfae816636ea055e4cdb05033185051cd))
* Bitstring status list entry ([0d1149f](https://github.com/uncefact/project-vckit/commit/0d1149f048f8e853bfd6bda4b0c99871ef76d8ed))
* Bitstring status list issue with enveloping proof ([#216](https://github.com/uncefact/project-vckit/issues/216)) ([2527fdb](https://github.com/uncefact/project-vckit/commit/2527fdb06c2b623911b8d8e4f83650208abbab21))
* **cd:** Ghcr.io setup and docker image build workflow ([#206](https://github.com/uncefact/project-vckit/issues/206)) ([3c359dc](https://github.com/uncefact/project-vckit/commit/3c359dc9f28421dba3d3b26d6fe3bbde5b549c4c))
* Configure automated changelog generation ([#237](https://github.com/uncefact/project-vckit/issues/237)) ([7ac71d5](https://github.com/uncefact/project-vckit/commit/7ac71d5e7f784a0108889d875208a63c53f5d25d))
* Create git workflow for release tagging and generate the release note ([#199](https://github.com/uncefact/project-vckit/issues/199)) ([8deaa53](https://github.com/uncefact/project-vckit/commit/8deaa533dec67db55af7c70bfbdb96565442fd0f))
* Credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889))
* Demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
* Dockerise vckit api ([#168](https://github.com/uncefact/project-vckit/issues/168)) ([2d3609b](https://github.com/uncefact/project-vckit/commit/2d3609b4e4b1c4ce4f82ac4ecbfc60b7bd17b446))
* Enable RenderTemplate2024 plugin ([#224](https://github.com/uncefact/project-vckit/issues/224)) ([01c07b8](https://github.com/uncefact/project-vckit/commit/01c07b899e1cbb54083c4aec30ea8089845f2eb4))
* Enhance credentials page for demo explorer package ([#161](https://github.com/uncefact/project-vckit/issues/161)) ([2e61b8f](https://github.com/uncefact/project-vckit/commit/2e61b8fb8f09cd2298c464341f7bb8d496b60dc0))
* Enveloping proof ([#207](https://github.com/uncefact/project-vckit/issues/207)) ([998356b](https://github.com/uncefact/project-vckit/commit/998356b0823610f95b557910a3bcb04567f25a15))
* Expose API router ([#235](https://github.com/uncefact/project-vckit/issues/235)) ([86ed930](https://github.com/uncefact/project-vckit/commit/86ed93089fb79d438fadf5dbb1eeefadeec7879d))
* Implement authenticate for vc api ([#215](https://github.com/uncefact/project-vckit/issues/215)) ([9b08b2c](https://github.com/uncefact/project-vckit/commit/9b08b2c4014da72cd97a67a7a22170614e6331ba))
* Implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
* Implement merkle disclosure proof 2021 ([#157](https://github.com/uncefact/project-vckit/issues/157)) ([6c7d2ed](https://github.com/uncefact/project-vckit/commit/6c7d2edbf65a7c3aa0b84e8faaf0da3a36de268f))
* Implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
* Implement renderer 2024 provider ([#177](https://github.com/uncefact/project-vckit/issues/177)) ([7bcbde3](https://github.com/uncefact/project-vckit/commit/7bcbde3b8f32cd85d94873799938df4cbc4098b4))
* Implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
* Implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
* Implement Swagger API for the new exposed APIs ([#236](https://github.com/uncefact/project-vckit/issues/236)) ([f0039d2](https://github.com/uncefact/project-vckit/commit/f0039d293eaa4e376f3a993e90f980abfe1f309b))
* Implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1))
* Implement vc api v2 in open api ([#178](https://github.com/uncefact/project-vckit/issues/178)) ([db8b185](https://github.com/uncefact/project-vckit/commit/db8b1858b62b7e307052ad870ee43c96dcbbb439))
* Implement versioning documentation ([#234](https://github.com/uncefact/project-vckit/issues/234)) ([a019686](https://github.com/uncefact/project-vckit/commit/a01968605e28257a62d52cf0c36f0c76e3e17114))
* Implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
* Include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
* Init base cli ([9dd38c7](https://github.com/uncefact/project-vckit/commit/9dd38c718d5356a88d1843ba8fe79f44dbb9bc67))
* Partial implementation of creadentials/issue ([3872204](https://github.com/uncefact/project-vckit/commit/387220457fd1f7aa36cf938bd613a1b329c8cb3b))
* Partial implementation of get /credentials ([6a0cca9](https://github.com/uncefact/project-vckit/commit/6a0cca916703ecfb6674f12653390b26a13efbbd))
* Partial implementation of identifiers/{did} ([e47ea92](https://github.com/uncefact/project-vckit/commit/e47ea9247374c96afde58a754f69fe68045d2b26))
* React components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3))
* Rendering process to handle credentials using enveloping proof ([#218](https://github.com/uncefact/project-vckit/issues/218)) ([54d6dfb](https://github.com/uncefact/project-vckit/commit/54d6dfb3886aa55b5de62126e574e415c2c7f56c))
* Restructure types and add OA types ([5c1ac47](https://github.com/uncefact/project-vckit/commit/5c1ac471939fa4aa94ad20999f7455a6543f109a))
* Revocation list 2020 ([#136](https://github.com/uncefact/project-vckit/issues/136)) ([094cd19](https://github.com/uncefact/project-vckit/commit/094cd192810b3f79d3cb926a2528a7fd13dd8db2))
* Seed test identifier ([#217](https://github.com/uncefact/project-vckit/issues/217)) ([bd3ee1c](https://github.com/uncefact/project-vckit/commit/bd3ee1c3fb8e548bf2cafca0760dcdec8b1badf4))
* Setup package workflow ([2e22d72](https://github.com/uncefact/project-vckit/commit/2e22d72a9d8d594d8d649d34b312166a82e5ed5b))
* Vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331))
* Vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e))


### Bug Fixes

* Add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
* Add interface for compute hash ([#179](https://github.com/uncefact/project-vckit/issues/179)) ([bc78c32](https://github.com/uncefact/project-vckit/commit/bc78c32e3c303d48168655c0dba1a888586a58ac))
* Add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
* Adjust bitstring status list model ([#214](https://github.com/uncefact/project-vckit/issues/214)) ([0f2b1c9](https://github.com/uncefact/project-vckit/commit/0f2b1c9f1ea6e5cdb3ec3109e97eb47a730d0d70))
* Bug fix for dockerize ([#174](https://github.com/uncefact/project-vckit/issues/174)) ([7422328](https://github.com/uncefact/project-vckit/commit/74223283c09b1e9d1b8b49ab5e0f841f51a05f9d))
* Cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda))
* Correct doc path and get rapidoc from cdn ([52ca9a3](https://github.com/uncefact/project-vckit/commit/52ca9a39bec733f76c0426be37521df0889678f2))
* Correct path and agent method call in router ([a4ba39e](https://github.com/uncefact/project-vckit/commit/a4ba39ea801bf3ff26565d5365c5366db7375430))
* Disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8))
* Get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
* Handle supportedProofFormats optional for revocation list ([950891e](https://github.com/uncefact/project-vckit/commit/950891eedbd68cb529513ba0ffb10e6e584bf7b5))
* Minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565))
* Provide meaningful error message when signature verification fails ([#197](https://github.com/uncefact/project-vckit/issues/197)) ([b6b18c6](https://github.com/uncefact/project-vckit/commit/b6b18c68e873fb0825b0605023ed81a302d5f356))
* Remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb))
* Renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f))
* Rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11))
* Resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
* Temp hardcode appwrite client ([ded38b9](https://github.com/uncefact/project-vckit/commit/ded38b97b22e42f342f7a27684c2a41b9619d2cf))
* The bitstring status is missing integration enveloping proof ([#219](https://github.com/uncefact/project-vckit/issues/219)) ([a21556a](https://github.com/uncefact/project-vckit/commit/a21556aabe256c5bc50684f3d36dde922f710d05))
* Update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
* Update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
* Update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf))
* Using revocation list on explorer and handle no hash ([#192](https://github.com/uncefact/project-vckit/issues/192)) ([95ba80e](https://github.com/uncefact/project-vckit/commit/95ba80eb2bb61cf97f1ef0b06357937165ab48f1))


### Code Refactoring

* Cache the context to reduce fetching ([#165](https://github.com/uncefact/project-vckit/issues/165)) ([d7b576f](https://github.com/uncefact/project-vckit/commit/d7b576f3d3bdde48f24ac7f432247fb0083ef1e8))
* Renderer method context and revocation list to map the context ([#156](https://github.com/uncefact/project-vckit/issues/156)) ([aa2da7a](https://github.com/uncefact/project-vckit/commit/aa2da7adf4b001f00620bbc42c46be5d541e48e3))
* Revocation list ([#147](https://github.com/uncefact/project-vckit/issues/147)) ([5a3e6a6](https://github.com/uncefact/project-vckit/commit/5a3e6a6e5ec12dc8a4a4146bbf348e3bcad5a201))
* Update vc-api comply vcdm v2 ([#221](https://github.com/uncefact/project-vckit/issues/221)) ([4ce0e09](https://github.com/uncefact/project-vckit/commit/4ce0e0977a03c1d7e9e2031d97cbef7338ea2250))
* Vc api structure ([#142](https://github.com/uncefact/project-vckit/issues/142)) ([63f93f0](https://github.com/uncefact/project-vckit/commit/63f93f0d2c0646c7648361792738b68b17e7c666))
* Verify DidIdentify for credential OA ([c6aeb98](https://github.com/uncefact/project-vckit/commit/c6aeb98529420b8a4316a855da60695b6dfa6b30))


### Tests

* Add integration test for svg template ([aeaf52d](https://github.com/uncefact/project-vckit/commit/aeaf52d6e4fac17ba6697ee64d11e8ceb607ea52))
* Add the e2e testing package ([ecc5990](https://github.com/uncefact/project-vckit/commit/ecc59902b27c7726c6aaec3d1033e74a9c48a2c5))
* Add unit test for svg template ([4911c49](https://github.com/uncefact/project-vckit/commit/4911c49e33d1044dda6aa3e00049bb02afa39869))
* Add unit test for the renderer plugin ([efcd817](https://github.com/uncefact/project-vckit/commit/efcd817b9d1b569627b65d80c7c1c127579467e7))
* Add unit test for WebRenderingTemplate2022 renderer provider ([5b57c79](https://github.com/uncefact/project-vckit/commit/5b57c79d774745f5dc936976c5c33a4876eaddf1))
* Improve mock data for unit test ([dac24a9](https://github.com/uncefact/project-vckit/commit/dac24a920f3e43cb6a5814e7734e771abdfd8110))
* Improve unit test in renderer package ([#159](https://github.com/uncefact/project-vckit/issues/159)) ([5db2616](https://github.com/uncefact/project-vckit/commit/5db2616d628d7f6e844139c58941ac073c15d4ba))
* Improve unit test of credential router package ([#160](https://github.com/uncefact/project-vckit/issues/160)) ([2ea8c65](https://github.com/uncefact/project-vckit/commit/2ea8c65cfca4d9843e814c5a28d0353d5a656449))


### Documentation

* Add documentation for revoking and activating a VC ([#223](https://github.com/uncefact/project-vckit/issues/223)) ([468739f](https://github.com/uncefact/project-vckit/commit/468739f048c768726dd0cf5c1ca663075b037ca8))
* Add documentation site ([#198](https://github.com/uncefact/project-vckit/issues/198)) ([d487a36](https://github.com/uncefact/project-vckit/commit/d487a366c9a427d4aad5b0bf952943233c4c7dc0))
* Add documentation to create did:web ([#220](https://github.com/uncefact/project-vckit/issues/220)) ([1dca289](https://github.com/uncefact/project-vckit/commit/1dca289ef401167d49f5835b214f70b90625ca20))
* Add new section in document about db encryption key ([#230](https://github.com/uncefact/project-vckit/issues/230)) ([ffc5001](https://github.com/uncefact/project-vckit/commit/ffc5001be7c1614ab75a80927b367635110992b8))
* Add readme ([012aa18](https://github.com/uncefact/project-vckit/commit/012aa18c909ad5e80721f42bf494d96e5d29ac11))
* Add release guide ([#240](https://github.com/uncefact/project-vckit/issues/240)) ([75274bd](https://github.com/uncefact/project-vckit/commit/75274bd326642473b1d341f6e4d56f0c2476ace6))
* Add storybook for svg template ([ef7e438](https://github.com/uncefact/project-vckit/commit/ef7e43892bef4f5e3009b37c7b38409dc33d2313))
* Add yarn to prerequisites ([fd8a955](https://github.com/uncefact/project-vckit/commit/fd8a955164a5caa44452e64720442ce096c0597e))
* Adds detail to vc-api rfc ([df8e07f](https://github.com/uncefact/project-vckit/commit/df8e07f84a3d755a086955d1191f86afab9d3f01))
* Change command name in missing config warnings ([41dca23](https://github.com/uncefact/project-vckit/commit/41dca233bfa5d05ef0db65ac073864a36a4fc01e))
* Deploy documentation site ([#210](https://github.com/uncefact/project-vckit/issues/210)) ([16846a2](https://github.com/uncefact/project-vckit/commit/16846a2cf2b577d81169dd6b1487fc45a8b7c794))
* Fix typo and update instruction ([#145](https://github.com/uncefact/project-vckit/issues/145)) ([5d1ed2e](https://github.com/uncefact/project-vckit/commit/5d1ed2e7c87aecd2fc5353598154e306a5a54a99))
* Init contributing guide and code of conduct ([0e76c28](https://github.com/uncefact/project-vckit/commit/0e76c28db11212bb7037d2dbd7831d5bf0ca8cc9))
* Init rfcs folder based on aries-rfcs ([66f360f](https://github.com/uncefact/project-vckit/commit/66f360f76f8e322b9ba2a036af5d7a89b57934c0))
* Initial draft renderer-plugin RFC ([61c2aaf](https://github.com/uncefact/project-vckit/commit/61c2aaf595d7eba0c8f67b07009360ff645f5154))
* Keep the default.yml use apiKey and update readme ([7428088](https://github.com/uncefact/project-vckit/commit/742808857c480062b377befbbe854fc793d7a31b))
* **rfcs:** Init base for vc-kit RFCs ([68b7272](https://github.com/uncefact/project-vckit/commit/68b7272e207616884b34f065b202d9ca75e0b23a))
* Update description ([bd92682](https://github.com/uncefact/project-vckit/commit/bd926823555fd35341b760cac33e0c3e7f97bf71))
* Update document ([59e7e2b](https://github.com/uncefact/project-vckit/commit/59e7e2b3bcfa005c8231a7c8be87e62769302f02))
* Update identifier creation ([#208](https://github.com/uncefact/project-vckit/issues/208)) ([58e2ac2](https://github.com/uncefact/project-vckit/commit/58e2ac243bd4878f7a7ca0490d71ed3a0da19ddc))
* Update instruction for node and pnpm version ([#144](https://github.com/uncefact/project-vckit/issues/144)) ([e927873](https://github.com/uncefact/project-vckit/commit/e92787338fcc6abc942ab79c3853d21dbce46470))
* Update readme ([#141](https://github.com/uncefact/project-vckit/issues/141)) ([71d85c0](https://github.com/uncefact/project-vckit/commit/71d85c09ac59d6db83af590375549c12016a3ae8))
* Update README.md documentation ([#164](https://github.com/uncefact/project-vckit/issues/164)) ([a8501b0](https://github.com/uncefact/project-vckit/commit/a8501b013490cbec98839c87a457958fba030568))
* Update renderer document for supporting enveloping proof ([#222](https://github.com/uncefact/project-vckit/issues/222)) ([9b56ea2](https://github.com/uncefact/project-vckit/commit/9b56ea2ac95e1d09ebb784658efdd29f9cc204ae))


### Miscellaneous

* Add @type/react-dom ([7a72464](https://github.com/uncefact/project-vckit/commit/7a7246407c74af8ac70f97c9c50bf086c385a840))
* Add api docs and base app ([58fbb62](https://github.com/uncefact/project-vckit/commit/58fbb62fb3b5b017024cf2b3636a7e331a58aaf1))
* Add cicd for running unit test when creating PR ([#180](https://github.com/uncefact/project-vckit/issues/180)) ([698f3a2](https://github.com/uncefact/project-vckit/commit/698f3a25a2292e37a73c3accaa3c9083e1006a48))
* Add credential-ld to cli package.json ([5284c34](https://github.com/uncefact/project-vckit/commit/5284c346eef97ca422a9f6f60660e4e97afd7a50))
* Add dockerfile in demo explorer ([#169](https://github.com/uncefact/project-vckit/issues/169)) ([9ba53aa](https://github.com/uncefact/project-vckit/commit/9ba53aae2d3d8755466a3ee6948ab2f1d41769ae))
* Add example .env file ([d9f25e3](https://github.com/uncefact/project-vckit/commit/d9f25e31378eef8fcff95b7931b3605c0cd4fcfc))
* Add initial RFC stubs ([33c8149](https://github.com/uncefact/project-vckit/commit/33c814942d0693e556c53c7051e1a19482302dd6))
* Add issue templates ([ad7c6c6](https://github.com/uncefact/project-vckit/commit/ad7c6c6997fa6fa9bda19bda6ad21f10eaa8a0b3))
* Add lerna config ([d479742](https://github.com/uncefact/project-vckit/commit/d479742cc5ac167ff2a8be3a0e16f5659c209c18))
* Add pull request template ([df730c1](https://github.com/uncefact/project-vckit/commit/df730c17d8f98c8915a7e5bbb2bd1627dd4ddc23))
* Add test and build workflows ([#239](https://github.com/uncefact/project-vckit/issues/239)) ([d742451](https://github.com/uncefact/project-vckit/commit/d7424518ba2befc04cd908bf1ad3adb3bd62fed1))
* Add the renderer plugin to the cli ([cfcaa6c](https://github.com/uncefact/project-vckit/commit/cfcaa6c0cec46eeb66c13a0b4961c8fad3d71d17))
* Add todo action ([1df2a18](https://github.com/uncefact/project-vckit/commit/1df2a186634610178c1e24183a223360fc8c51f5))
* Add unit tests ([ff3789a](https://github.com/uncefact/project-vckit/commit/ff3789a41bd8450025970f5f6cce1df4d7fdfd92))
* Add version script ([dbbd85d](https://github.com/uncefact/project-vckit/commit/dbbd85dd6e131849bc4222794ffd26ce0614e8e4))
* Add version to top level package.json ([17fc008](https://github.com/uncefact/project-vckit/commit/17fc008148afafb3ef04f7d153d3cb3d146f650f))
* Add watch script to packages ([395ca32](https://github.com/uncefact/project-vckit/commit/395ca32c1059d5ca39bff011d4333b770113218f))
* Adjust package workflow to trigger on tag beta ([48909f3](https://github.com/uncefact/project-vckit/commit/48909f39284a6fc99c00de894e76c1533888dfe8))
* Align package versions ([78b7477](https://github.com/uncefact/project-vckit/commit/78b7477f3e3fb2a0e05dcc2943afe0e3f7dc03ad))
* Change context ([ab623c3](https://github.com/uncefact/project-vckit/commit/ab623c3293d34c23d9f98e09dbbe5932b41dbab7))
* Change hardcode URL to dynamic URL in agent file ([#229](https://github.com/uncefact/project-vckit/issues/229)) ([8a1a7ea](https://github.com/uncefact/project-vckit/commit/8a1a7ea5a51ac7d0fca699fd7b3759efe581b5fa))
* Change node version to 20.12.2 ([#187](https://github.com/uncefact/project-vckit/issues/187)) ([f67b989](https://github.com/uncefact/project-vckit/commit/f67b989e7f45c297874b9c0f40bc14e71930f194))
* Clean slate ([3952390](https://github.com/uncefact/project-vckit/commit/395239002b5b063c7be39b41001f87bf2992b387))
* Cleanup old project files ([74c7055](https://github.com/uncefact/project-vckit/commit/74c705513b39806b83ce468270a226a06695e2d3))
* Delete old action ([816885c](https://github.com/uncefact/project-vckit/commit/816885c5e5d4787bd1c59379112837542875cb09))
* Dependency updates from oa-renderers package ([f083615](https://github.com/uncefact/project-vckit/commit/f08361561bd258434f16f7f2eb86fc9b1fed4c15))
* Disable github action for todo ([#140](https://github.com/uncefact/project-vckit/issues/140)) ([550a2ab](https://github.com/uncefact/project-vckit/commit/550a2ab4d417145b5d3e26fe3f1278ab24093f75))
* Fix build script, ignore all postinstall script ([2adb515](https://github.com/uncefact/project-vckit/commit/2adb5153e98977bb74ae77a39a167989683c5374))
* Fix core-types package file ([fddee57](https://github.com/uncefact/project-vckit/commit/fddee57c14b1186ed95dd45dd5c0073bcb7b0089))
* Fix deployment for UN ([2adf8de](https://github.com/uncefact/project-vckit/commit/2adf8de813a1bfd2499f5a65d9fbb09e8ac45618))
* Fix incorrect app version ([08a882e](https://github.com/uncefact/project-vckit/commit/08a882e4240e60e060772fc97708f62316601921))
* Fix package script name ([d81d7bd](https://github.com/uncefact/project-vckit/commit/d81d7bd7c579e80b3bfa4cc4f8f9d3c8dd8ec755))
* Fix the dependency ([72ea4e9](https://github.com/uncefact/project-vckit/commit/72ea4e9fc303144174700064f9cfb164e80ceb82))
* Fix the dockerfile to set entrypoint ([1432b34](https://github.com/uncefact/project-vckit/commit/1432b34e258823d3e9a0059292bc909b51078488))
* Fix the open api path ([251cb5a](https://github.com/uncefact/project-vckit/commit/251cb5aa2de18727cb9ea2805c186a598af16a8f))
* Fix version of react ([eed6f3e](https://github.com/uncefact/project-vckit/commit/eed6f3e5ca9a51d4e4bc248582694722040c0a77))
* Fix version of react and react-dom ([5e04a23](https://github.com/uncefact/project-vckit/commit/5e04a239b457b2dc134585c25727bf16a890e5a8))
* Fix version pnpm for github action ([58175f6](https://github.com/uncefact/project-vckit/commit/58175f65b77d6c6efcd89ba2e7879cf2c0c4c623))
* Fix version references ([e3bc94a](https://github.com/uncefact/project-vckit/commit/e3bc94a9df815150ea5eeeb683fff5abc2cebaf3))
* Fix version vckit core-type ([4cf9622](https://github.com/uncefact/project-vckit/commit/4cf9622850cbfa9f7c2f4b464818f66ec75e4ac9))
* Ignore /scratch folder ([b9f22fc](https://github.com/uncefact/project-vckit/commit/b9f22fc1b071c92ce469fe8e689475f239609719))
* Ignore scripts when run build api ([b8f9796](https://github.com/uncefact/project-vckit/commit/b8f9796efa1780d76ffa353c5de44881804977aa))
* Import oa renderer into project-vckit ([9720782](https://github.com/uncefact/project-vckit/commit/97207824078eb1d48714871f06c543c5fb3cafad))
* Import top level credential handler plugin ([f5475e3](https://github.com/uncefact/project-vckit/commit/f5475e345a08a0704c0ed95fd903653baaa3e048))
* Init api and ui components ([5549d2c](https://github.com/uncefact/project-vckit/commit/5549d2cabff61fbfc86bb1ac2f049712ee405b0e))
* Init libs ([4c891d5](https://github.com/uncefact/project-vckit/commit/4c891d5667f9df52b92e075bebbe1249aeeadee8))
* Init pnpm workspace ([118c5c9](https://github.com/uncefact/project-vckit/commit/118c5c952cc1e96b2c42dbebbb875a72d53fd451))
* Init pulumi config ([3d489c9](https://github.com/uncefact/project-vckit/commit/3d489c9f9e4a973d8dbe145b2a50d1afd36542e4))
* Init vckit ui ([3985dda](https://github.com/uncefact/project-vckit/commit/3985dda73363763702cdf747366fddcfe45fdc1d))
* Initial setup of OA plugin ([1ded78f](https://github.com/uncefact/project-vckit/commit/1ded78fcfeaea99ad50d419cf98affe70a4be568))
* Lock package versions ([d95066e](https://github.com/uncefact/project-vckit/commit/d95066ee27fffd20e6b99610bfb7b11291d3e31c))
* Merge docker-compose ([2c947ce](https://github.com/uncefact/project-vckit/commit/2c947cee91c3ac8a336198bbf9c1d83c445d75c0))
* Oa renderers should be publishable ([e0fda01](https://github.com/uncefact/project-vckit/commit/e0fda01db9b12f6a297f47075f480360dd19410e))
* Public packages ([3929e3f](https://github.com/uncefact/project-vckit/commit/3929e3fdbd9b220074cf15f27126d8b5d84143ec))
* Publish minor version ([83bc60c](https://github.com/uncefact/project-vckit/commit/83bc60c98bd7a279a639b3c08509ac56a5365abf))
* Pull app component out to feature branch ([41c6bb9](https://github.com/uncefact/project-vckit/commit/41c6bb90b986c91cab657aa5766fb7dcdcd37f1b))
* Pull veramo components we want to extend ([eae81f4](https://github.com/uncefact/project-vckit/commit/eae81f47514a6ce88cd665b56919a794a6abed76))
* Release 1.0.0 ([e890a47](https://github.com/uncefact/project-vckit/commit/e890a47201f9e3195bf9f9828a20ae20a581ef56))
* Release new version ([7cf6e7a](https://github.com/uncefact/project-vckit/commit/7cf6e7ad4179fb365f376054fda6cc60f44308e3))
* Release new version 1.0.0-beta.8 ([fa1249e](https://github.com/uncefact/project-vckit/commit/fa1249eecf53b71375388eaa04428367fab51b31))
* Release new version 1.0.0-beta.9 ([b96b0ed](https://github.com/uncefact/project-vckit/commit/b96b0ed2a49611c4c81fd8a40fc18569cec41e4a))
* **release:** V0.2.0 [skip ci] ([5499c6d](https://github.com/uncefact/project-vckit/commit/5499c6de4cc19ea3edd3a72a42889fd1e10b16ec))
* **release:** V0.2.1 [skip ci] ([8d67803](https://github.com/uncefact/project-vckit/commit/8d67803c41bb5809431a1439aeb345b9f84eaacf))
* **release:** V0.2.2 [skip ci] ([d812c8a](https://github.com/uncefact/project-vckit/commit/d812c8a9b301a3de69916ed1e1832596ee89040e))
* **release:** V0.3.0 [skip ci] ([21c1d5a](https://github.com/uncefact/project-vckit/commit/21c1d5a8eb4890754b5d1692f47db074081114aa))
* **release:** V1.0.0-beta.1 [skip ci] ([b6283ac](https://github.com/uncefact/project-vckit/commit/b6283ac181405507a79201324d1102cf6b54061c))
* **release:** V1.0.0-beta.2 [skip ci] ([3df3631](https://github.com/uncefact/project-vckit/commit/3df3631d9d804f3e469c0d18c85d91454677296f))
* **release:** V1.0.0-beta.4 [skip ci] ([cc1c452](https://github.com/uncefact/project-vckit/commit/cc1c452c18e8b81849cefe48d944bc5d6b0e1b5d))
* **release:** V1.0.0-beta.5 [skip ci] ([6197068](https://github.com/uncefact/project-vckit/commit/61970680182d6d704df6c30abb234d5c81a3d64e))
* **release:** Version bump to 1 beta ([ae3a326](https://github.com/uncefact/project-vckit/commit/ae3a326b0a68719419d626a3486873c008880d80))
* **release:** Version bump to remove incorrect build folders packages ([6450f99](https://github.com/uncefact/project-vckit/commit/6450f9931929c6940ccf87ab7e89a5215e1cda42))
* Remove .gitigonore ([3e85355](https://github.com/uncefact/project-vckit/commit/3e853557c81d94edc2741be5f5ca71025b4393af))
* Remove @type/react-dom ([394f654](https://github.com/uncefact/project-vckit/commit/394f654830dc9580da94c5115ba9d5fe3c4ccb5b))
* Remove cached build file ([87691c6](https://github.com/uncefact/project-vckit/commit/87691c6ffb49f3129dc742339ab055d885f1af41))
* Remove draft oa issuer plugin ([f63df24](https://github.com/uncefact/project-vckit/commit/f63df24974edbdbf362c764c6355c6ca1b63a63b))
* Remove private flag from top level package.json ([99e33d4](https://github.com/uncefact/project-vckit/commit/99e33d4b8584b59312cb106dbafa2ed3a96a102f))
* Remove the unused configuration ([49840c7](https://github.com/uncefact/project-vckit/commit/49840c7e349f6b4d39efe5cee6088d9be52cf7c1))
* Renaiming things ([157d1c4](https://github.com/uncefact/project-vckit/commit/157d1c4329163b26b33a26ae428b6b8fd1acdf11))
* Rename vckit-ui component ([6221b10](https://github.com/uncefact/project-vckit/commit/6221b1078395282ba32f46f93fc26d113247fe83))
* Rename veramo components we will extend ([c9341c4](https://github.com/uncefact/project-vckit/commit/c9341c46d35c1b0d969cef01d518d9eb9fba0ca1))
* Reset changelog and readme for example docs ([c605b6f](https://github.com/uncefact/project-vckit/commit/c605b6fb6379a5e6ae9acc55b2781d34b5e4350b))
* Revert core types ([0b54659](https://github.com/uncefact/project-vckit/commit/0b5465945dc5f5eba591119de2eb6cf01c6ecbbb))
* Run --fix-lockfile ([50e7832](https://github.com/uncefact/project-vckit/commit/50e78323073875013b1d4fe4b68c011d2fd49b59))
* Set demo-explorer in private ([1e73280](https://github.com/uncefact/project-vckit/commit/1e73280fe18b05028872e287dea3d33a33eeff66))
* Set document build process in build and test workflow ([#233](https://github.com/uncefact/project-vckit/issues/233)) ([2b517ad](https://github.com/uncefact/project-vckit/commit/2b517ad825b36c629e0e66d1690ceef2806e1b0e))
* Setup ci cd ([#154](https://github.com/uncefact/project-vckit/issues/154)) ([9febd39](https://github.com/uncefact/project-vckit/commit/9febd39fb54a2d2c5469530b4dc7d61cf522bdbe))
* Setup CICD to deploy to S3 ([#85](https://github.com/uncefact/project-vckit/issues/85)) ([46b7fc2](https://github.com/uncefact/project-vckit/commit/46b7fc29f7bd9257b40032c22e625a16a37669a5))
* Setup unit test relies on veramo setting ([0f47607](https://github.com/uncefact/project-vckit/commit/0f4760777242e36357a8fb61a53a0749469ee926))
* Stub oa issuer plugin ([2202a43](https://github.com/uncefact/project-vckit/commit/2202a4370e88108a23b8da49c80cd1a36404d220))
* Switch to veramo credential packages ([b2023be](https://github.com/uncefact/project-vckit/commit/b2023beadc58e82214621a83edf46c432df190f1))
* Temporary set CI false ([105418b](https://github.com/uncefact/project-vckit/commit/105418ba5f0f0bb516d7e4d7393e8460dd01da07))
* Test todo action ([2faf9dc](https://github.com/uncefact/project-vckit/commit/2faf9dc4ef3dc4b25693e5a3fa878552999f755b))
* Update .gitignore ([9c0e792](https://github.com/uncefact/project-vckit/commit/9c0e7923118717e176a0ea59a9c4e95d92ea2804))
* Update [@emotion](https://github.com/emotion) library, adjust to use pnpm structure ([bad44b0](https://github.com/uncefact/project-vckit/commit/bad44b038d5430a6cb3889fe16a7cfa5fb26efc4))
* Update agent config file ([#181](https://github.com/uncefact/project-vckit/issues/181)) ([07125f9](https://github.com/uncefact/project-vckit/commit/07125f9ae346a3e18e7b1f2f05a6fb1760fe8c81))
* Update arguments and envs for the Dockerfile ([#194](https://github.com/uncefact/project-vckit/issues/194)) ([234c72e](https://github.com/uncefact/project-vckit/commit/234c72e209beed12502ee3e879354a3c9974202d))
* Update bitstring status package ([#211](https://github.com/uncefact/project-vckit/issues/211)) ([89a60b5](https://github.com/uncefact/project-vckit/commit/89a60b543e0ffd40937dcfeb6d35a4a430e4550b))
* Update bug report template ([f9d89a4](https://github.com/uncefact/project-vckit/commit/f9d89a4f4d3e3bdaef8a1bb3e0109c98c9d52ead))
* Update CD script ([2cec8d0](https://github.com/uncefact/project-vckit/commit/2cec8d01595defb82263ea31e6e10ff588489556))
* Update contributing guide and code of contuct ([1f618ca](https://github.com/uncefact/project-vckit/commit/1f618caa12d18922e2864db826fbfaf70b367f9b))
* Update default agent for Status plugin ([#186](https://github.com/uncefact/project-vckit/issues/186)) ([680d7cd](https://github.com/uncefact/project-vckit/commit/680d7cd7f93c45f344068ddcb21affc7be1c855a))
* Update deps and add watch for remote-server ([2a15243](https://github.com/uncefact/project-vckit/commit/2a152435a5d126119c34fddb3c8b81f058df59ff))
* Update DockerFile and agent template ([#183](https://github.com/uncefact/project-vckit/issues/183)) ([ac2dacd](https://github.com/uncefact/project-vckit/commit/ac2dacd40d12983e6b6879b305cc61191db3e454))
* Update example documents tsconfig and readme ([915d294](https://github.com/uncefact/project-vckit/commit/915d29466233f5c3207d95167145aeafd162aef1))
* Update example for svg template ([a716745](https://github.com/uncefact/project-vckit/commit/a716745e5e0bb45903202dbaf78b5df9da8da2a2))
* Update lerna config ([0d56fcf](https://github.com/uncefact/project-vckit/commit/0d56fcf8ff2cc0f7eee0832c163f06c6d46fdb37))
* Update license for compatibility ([a3623c2](https://github.com/uncefact/project-vckit/commit/a3623c2134dbfd6d132e34180775bd61c8d92858))
* Update lock file ([f8e9ff2](https://github.com/uncefact/project-vckit/commit/f8e9ff2e775b4d51c9cea85e36642dc0e6ad477f))
* Update lockfile ([d08789a](https://github.com/uncefact/project-vckit/commit/d08789aa8f9eee25347a41f2d4388a5b9d2e767e))
* Update lockfile ([3ecbd19](https://github.com/uncefact/project-vckit/commit/3ecbd192172dba4aa868507a4a4de731ee8f4e5b))
* Update new versions ([55617d9](https://github.com/uncefact/project-vckit/commit/55617d9f2b6120ca05667fc7413d5c6e71320434))
* Update node version ([0c59fd5](https://github.com/uncefact/project-vckit/commit/0c59fd5b4ce8d503bddd1595c067a4688b4c5d66))
* Update package lock file ([811aced](https://github.com/uncefact/project-vckit/commit/811acedfda67908c2ee798359010d85d98f7b562))
* Update package version ([64a60a0](https://github.com/uncefact/project-vckit/commit/64a60a0a73d86fceb75cdd8b6e15b9282e61aaae))
* Update rfcs index ([d40a80b](https://github.com/uncefact/project-vckit/commit/d40a80b6141fc0101b24843cef38210f639f6c9d))
* Update the unit test configurations ([#113](https://github.com/uncefact/project-vckit/issues/113)) ([0c3c3dd](https://github.com/uncefact/project-vckit/commit/0c3c3dd1c801fc35c5c8f0357fd1c5ba00012777))
* Update vckit Dockerfile ([#184](https://github.com/uncefact/project-vckit/issues/184)) ([0f466bb](https://github.com/uncefact/project-vckit/commit/0f466bb640341833d9b3fa550340a4d424f5e652))
* Update workflow and dockerfile ([#213](https://github.com/uncefact/project-vckit/issues/213)) ([c3dbcb7](https://github.com/uncefact/project-vckit/commit/c3dbcb73c44120aa05f644e29b2f4c3d24b2d27a))
* Upgrade dependencies ([#158](https://github.com/uncefact/project-vckit/issues/158)) ([138aa81](https://github.com/uncefact/project-vckit/commit/138aa815b9d6be6f7a4815cffd231e23744f40a4))

## [0.2.2](https://github.com/uncefact/project-vckit/compare/v0.2.1...v0.2.2) (2023-05-03)

**Note:** Version bump only for package vckit

## [0.2.1](https://github.com/uncefact/project-vckit/compare/v0.2.0...v0.2.1) (2023-05-02)

**Note:** Version bump only for package vckit

# 0.2.0 (2023-05-02)

### Features

- **agent:** initialise agent library ([#3](https://github.com/uncefact/project-vckit/issues/3)) ([e5fa0ad](https://github.com/uncefact/project-vckit/commit/e5fa0adac88efefd2f100fd8dc7230758fcae078))
- init base cli ([50fa0c0](https://github.com/uncefact/project-vckit/commit/50fa0c0c96c4568bd534999d67235cb6dad41746))
- partial implementation of creadentials/issue ([0f313ff](https://github.com/uncefact/project-vckit/commit/0f313ffcc790c2c18d0cde06e7866ab80626bb76))
- partial implementation of get /credentials ([3ba88d6](https://github.com/uncefact/project-vckit/commit/3ba88d6cd649faa8b55266508a6c2402c12aeacf))
- partial implementation of identifiers/{did} ([c6cf61b](https://github.com/uncefact/project-vckit/commit/c6cf61bd0953caeea208c2f7294bc783cd8f20df))
- restructure types and add OA types ([3eb493d](https://github.com/uncefact/project-vckit/commit/3eb493dc497148baba5f0027227f89567c563a96))
