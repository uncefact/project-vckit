# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.9](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2024-09-24)


### Bug Fixes

* adjust bitstring status list model ([#214](https://github.com/uncefact/project-vckit/issues/214)) ([0f2b1c9](https://github.com/uncefact/project-vckit/commit/0f2b1c9f1ea6e5cdb3ec3109e97eb47a730d0d70)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)


### Features

* implement authenticate for vc api ([#215](https://github.com/uncefact/project-vckit/issues/215)) ([9b08b2c](https://github.com/uncefact/project-vckit/commit/9b08b2c4014da72cd97a67a7a22170614e6331ba)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)





# [1.0.0-beta.8](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.8) (2024-09-19)


### Bug Fixes

* add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
* add interface for compute hash ([#179](https://github.com/uncefact/project-vckit/issues/179)) ([bc78c32](https://github.com/uncefact/project-vckit/commit/bc78c32e3c303d48168655c0dba1a888586a58ac)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
* bug fix for dockerize ([#174](https://github.com/uncefact/project-vckit/issues/174)) ([7422328](https://github.com/uncefact/project-vckit/commit/74223283c09b1e9d1b8b49ab5e0f841f51a05f9d)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
* handle supportedProofFormats optional for revocation list ([950891e](https://github.com/uncefact/project-vckit/commit/950891eedbd68cb529513ba0ffb10e6e584bf7b5))
* minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* Provide meaningful error message when signature verification fails ([#197](https://github.com/uncefact/project-vckit/issues/197)) ([b6b18c6](https://github.com/uncefact/project-vckit/commit/b6b18c68e873fb0825b0605023ed81a302d5f356)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
* update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
* update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
* update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* using revocation list on explorer and handle no hash ([#192](https://github.com/uncefact/project-vckit/issues/192)) ([95ba80e](https://github.com/uncefact/project-vckit/commit/95ba80eb2bb61cf97f1ef0b06357937165ab48f1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)


### Features

* Add `eddsa-rdfc-2022-cryptosuite` Plugin ([#200](https://github.com/uncefact/project-vckit/issues/200)) ([d651176](https://github.com/uncefact/project-vckit/commit/d651176bd852514cfda37d9098e84663d1ac9be2)), closes [vckit/credential-data-integrity#VCkitEddsaRdfc2022](https://github.com/vckit/credential-data-integrity/issues/VCkitEddsaRdfc2022)
* add compute hash utils ([#175](https://github.com/uncefact/project-vckit/issues/175)) ([6eb5802](https://github.com/uncefact/project-vckit/commit/6eb5802658bddd74e0d2fbb6225421a7394a4834)), closes [/w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023](https://github.com//w3c-ccg.github.io/vc-render-method//issues/svgrenderingtemplate2023) [/w3c-ccg.github.io/multibase/#tv-base58](https://github.com//w3c-ccg.github.io/multibase//issues/tv-base58) [#123](https://github.com/uncefact/project-vckit/issues/123)
* adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
* bitstring status list entry  ([0d1149f](https://github.com/uncefact/project-vckit/commit/0d1149f048f8e853bfd6bda4b0c99871ef76d8ed))
* **cd:** ghcr.io setup and docker image build workflow ([#206](https://github.com/uncefact/project-vckit/issues/206)) ([3c359dc](https://github.com/uncefact/project-vckit/commit/3c359dc9f28421dba3d3b26d6fe3bbde5b549c4c)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* create git workflow for release tagging and generate the release note ([#199](https://github.com/uncefact/project-vckit/issues/199)) ([8deaa53](https://github.com/uncefact/project-vckit/commit/8deaa533dec67db55af7c70bfbdb96565442fd0f))
* credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
* dockerise vckit api ([#168](https://github.com/uncefact/project-vckit/issues/168)) ([2d3609b](https://github.com/uncefact/project-vckit/commit/2d3609b4e4b1c4ce4f82ac4ecbfc60b7bd17b446)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* enhance credentials page for demo explorer package ([#161](https://github.com/uncefact/project-vckit/issues/161)) ([2e61b8f](https://github.com/uncefact/project-vckit/commit/2e61b8fb8f09cd2298c464341f7bb8d496b60dc0)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* enveloping proof ([#207](https://github.com/uncefact/project-vckit/issues/207)) ([998356b](https://github.com/uncefact/project-vckit/commit/998356b0823610f95b557910a3bcb04567f25a15)), closes [3332/credentials/status/bitstring-status-list/5#0](https://github.com/3332/credentials/status/bitstring-status-list/5/issues/0) [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
* implement merkle disclosure proof 2021 ([#157](https://github.com/uncefact/project-vckit/issues/157)) ([6c7d2ed](https://github.com/uncefact/project-vckit/commit/6c7d2edbf65a7c3aa0b84e8faaf0da3a36de268f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
* implement renderer 2024 provider ([#177](https://github.com/uncefact/project-vckit/issues/177)) ([7bcbde3](https://github.com/uncefact/project-vckit/commit/7bcbde3b8f32cd85d94873799938df4cbc4098b4))
* implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
* implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
* implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement vc api v2 in open api ([#178](https://github.com/uncefact/project-vckit/issues/178)) ([db8b185](https://github.com/uncefact/project-vckit/commit/db8b1858b62b7e307052ad870ee43c96dcbbb439)), closes [function#V1](https://github.com/function/issues/V1) [function#V2](https://github.com/function/issues/V2) [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
* include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
* react components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* setup package workflow ([2e22d72](https://github.com/uncefact/project-vckit/commit/2e22d72a9d8d594d8d649d34b312166a82e5ed5b))
* vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)





# [1.0.0-beta.8](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.8) (2024-09-19)


### Bug Fixes

* add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
* add interface for compute hash ([#179](https://github.com/uncefact/project-vckit/issues/179)) ([bc78c32](https://github.com/uncefact/project-vckit/commit/bc78c32e3c303d48168655c0dba1a888586a58ac)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
* bug fix for dockerize ([#174](https://github.com/uncefact/project-vckit/issues/174)) ([7422328](https://github.com/uncefact/project-vckit/commit/74223283c09b1e9d1b8b49ab5e0f841f51a05f9d)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
* handle supportedProofFormats optional for revocation list ([950891e](https://github.com/uncefact/project-vckit/commit/950891eedbd68cb529513ba0ffb10e6e584bf7b5))
* minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* Provide meaningful error message when signature verification fails ([#197](https://github.com/uncefact/project-vckit/issues/197)) ([b6b18c6](https://github.com/uncefact/project-vckit/commit/b6b18c68e873fb0825b0605023ed81a302d5f356)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
* update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
* update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
* update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* using revocation list on explorer and handle no hash ([#192](https://github.com/uncefact/project-vckit/issues/192)) ([95ba80e](https://github.com/uncefact/project-vckit/commit/95ba80eb2bb61cf97f1ef0b06357937165ab48f1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)


### Features

* Add `eddsa-rdfc-2022-cryptosuite` Plugin ([#200](https://github.com/uncefact/project-vckit/issues/200)) ([d651176](https://github.com/uncefact/project-vckit/commit/d651176bd852514cfda37d9098e84663d1ac9be2)), closes [vckit/credential-data-integrity#VCkitEddsaRdfc2022](https://github.com/vckit/credential-data-integrity/issues/VCkitEddsaRdfc2022)
* add compute hash utils ([#175](https://github.com/uncefact/project-vckit/issues/175)) ([6eb5802](https://github.com/uncefact/project-vckit/commit/6eb5802658bddd74e0d2fbb6225421a7394a4834)), closes [/w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023](https://github.com//w3c-ccg.github.io/vc-render-method//issues/svgrenderingtemplate2023) [/w3c-ccg.github.io/multibase/#tv-base58](https://github.com//w3c-ccg.github.io/multibase//issues/tv-base58) [#123](https://github.com/uncefact/project-vckit/issues/123)
* adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
* bitstring status list entry  ([0d1149f](https://github.com/uncefact/project-vckit/commit/0d1149f048f8e853bfd6bda4b0c99871ef76d8ed))
* **cd:** ghcr.io setup and docker image build workflow ([#206](https://github.com/uncefact/project-vckit/issues/206)) ([3c359dc](https://github.com/uncefact/project-vckit/commit/3c359dc9f28421dba3d3b26d6fe3bbde5b549c4c)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* create git workflow for release tagging and generate the release note ([#199](https://github.com/uncefact/project-vckit/issues/199)) ([8deaa53](https://github.com/uncefact/project-vckit/commit/8deaa533dec67db55af7c70bfbdb96565442fd0f))
* credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
* dockerise vckit api ([#168](https://github.com/uncefact/project-vckit/issues/168)) ([2d3609b](https://github.com/uncefact/project-vckit/commit/2d3609b4e4b1c4ce4f82ac4ecbfc60b7bd17b446)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* enhance credentials page for demo explorer package ([#161](https://github.com/uncefact/project-vckit/issues/161)) ([2e61b8f](https://github.com/uncefact/project-vckit/commit/2e61b8fb8f09cd2298c464341f7bb8d496b60dc0)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* enveloping proof ([#207](https://github.com/uncefact/project-vckit/issues/207)) ([998356b](https://github.com/uncefact/project-vckit/commit/998356b0823610f95b557910a3bcb04567f25a15)), closes [3332/credentials/status/bitstring-status-list/5#0](https://github.com/3332/credentials/status/bitstring-status-list/5/issues/0) [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
* implement merkle disclosure proof 2021 ([#157](https://github.com/uncefact/project-vckit/issues/157)) ([6c7d2ed](https://github.com/uncefact/project-vckit/commit/6c7d2edbf65a7c3aa0b84e8faaf0da3a36de268f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
* implement renderer 2024 provider ([#177](https://github.com/uncefact/project-vckit/issues/177)) ([7bcbde3](https://github.com/uncefact/project-vckit/commit/7bcbde3b8f32cd85d94873799938df4cbc4098b4))
* implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
* implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
* implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement vc api v2 in open api ([#178](https://github.com/uncefact/project-vckit/issues/178)) ([db8b185](https://github.com/uncefact/project-vckit/commit/db8b1858b62b7e307052ad870ee43c96dcbbb439)), closes [function#V1](https://github.com/function/issues/V1) [function#V2](https://github.com/function/issues/V2) [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
* include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
* react components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* setup package workflow ([2e22d72](https://github.com/uncefact/project-vckit/commit/2e22d72a9d8d594d8d649d34b312166a82e5ed5b))
* vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)





# [1.0.0-beta.7](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.7) (2023-10-11)


### Bug Fixes

* add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
* add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
* cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
* minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
* update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
* update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
* update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)


### Features

* adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
* credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
* implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
* implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
* implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
* implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
* implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
* include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
* react components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)





# [1.0.0-beta.6](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.6) (2023-10-09)


### Bug Fixes

* add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
* add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
* cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* disable openattestation until metadata is configured ([#151](https://github.com/uncefact/project-vckit/issues/151)) ([96de874](https://github.com/uncefact/project-vckit/commit/96de87479c6ab3a10c69463236ed4c94d940d8c8)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* get correct information for issuer for OA document ([e019a5b](https://github.com/uncefact/project-vckit/commit/e019a5bcef088ce3e71377cac7b8713f31c96751))
* minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* remove openattestation field update for input change ([#152](https://github.com/uncefact/project-vckit/issues/152)) ([660be5b](https://github.com/uncefact/project-vckit/commit/660be5b3715c3dbbafc8fb2d08c5e27934ae1bfb)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* renderer expand jsonld incorrectly ([#133](https://github.com/uncefact/project-vckit/issues/133)) ([d6fd38f](https://github.com/uncefact/project-vckit/commit/d6fd38fb9943aea124ce748bcf9ea19cfa6eaf2f)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
* update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
* update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
* update migration index ([#149](https://github.com/uncefact/project-vckit/issues/149)) ([caf7455](https://github.com/uncefact/project-vckit/commit/caf7455228896eff0794c38ceec4a89c7e0645cf)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)


### Features

* adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
* credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* demo agent explorer ui ([2abcce1](https://github.com/uncefact/project-vckit/commit/2abcce1c8ba29dccad85f7d40abe832d02326b63))
* implement credential oa plugin ([354e38d](https://github.com/uncefact/project-vckit/commit/354e38dd608a3dc0ce83d02334bec2616e8036a2))
* implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
* implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
* implement svg template for OA renderer ([01277f3](https://github.com/uncefact/project-vckit/commit/01277f370b7aae99e4e0bcae92a6b332b958e8cd))
* implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* implement WebRenderingTemplate2022 renderer provider ([93d1399](https://github.com/uncefact/project-vckit/commit/93d139999139bd4aa9a52e202e1e9c32f3a79b69))
* include credential in response from agent ([117634e](https://github.com/uncefact/project-vckit/commit/117634e91b0383ba93ed3b143c3c8770666b50c9))
* react components package, QR code component ([#134](https://github.com/uncefact/project-vckit/issues/134)) ([3b9e3de](https://github.com/uncefact/project-vckit/commit/3b9e3de1a26977ab51c63628556121743620c0d3)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
* vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)





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
