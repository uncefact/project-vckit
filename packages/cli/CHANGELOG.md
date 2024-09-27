# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.10](https://github.com/uport-project/veramo/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2024-09-27)

**Note:** Version bump only for package @vckit/cli





# [1.0.0-beta.9](https://github.com/uport-project/veramo/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2024-09-24)

### Features

- implement authenticate for vc api ([#215](https://github.com/uport-project/veramo/issues/215)) ([9b08b2c](https://github.com/uport-project/veramo/commit/9b08b2c4014da72cd97a67a7a22170614e6331ba)), closes [#123](https://github.com/uport-project/veramo/issues/123)

# [1.0.0-beta.8](https://github.com/uport-project/veramo/compare/v1.0.0-beta.2...v1.0.0-beta.8) (2024-09-19)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uport-project/veramo/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add interface for compute hash ([#179](https://github.com/uport-project/veramo/issues/179)) ([bc78c32](https://github.com/uport-project/veramo/commit/bc78c32e3c303d48168655c0dba1a888586a58ac)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- add missing plugin schema ([#97](https://github.com/uport-project/veramo/issues/97)) ([78cd8fa](https://github.com/uport-project/veramo/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- cd script ([#155](https://github.com/uport-project/veramo/issues/155)) ([4345d98](https://github.com/uport-project/veramo/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- minor issues ([#153](https://github.com/uport-project/veramo/issues/153)) ([cf8c801](https://github.com/uport-project/veramo/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- rendering issue ([#148](https://github.com/uport-project/veramo/issues/148)) ([c8bb087](https://github.com/uport-project/veramo/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uport-project/veramo/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uport-project/veramo/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uport-project/veramo/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))
- using revocation list on explorer and handle no hash ([#192](https://github.com/uport-project/veramo/issues/192)) ([95ba80e](https://github.com/uport-project/veramo/commit/95ba80eb2bb61cf97f1ef0b06357937165ab48f1)), closes [#123](https://github.com/uport-project/veramo/issues/123)

### Features

- Add `eddsa-rdfc-2022-cryptosuite` Plugin ([#200](https://github.com/uport-project/veramo/issues/200)) ([d651176](https://github.com/uport-project/veramo/commit/d651176bd852514cfda37d9098e84663d1ac9be2)), closes [vckit/credential-data-integrity#VCkitEddsaRdfc2022](https://github.com/vckit/credential-data-integrity/issues/VCkitEddsaRdfc2022)
- add compute hash utils ([#175](https://github.com/uport-project/veramo/issues/175)) ([6eb5802](https://github.com/uport-project/veramo/commit/6eb5802658bddd74e0d2fbb6225421a7394a4834)), closes [/w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023](https://github.com//w3c-ccg.github.io/vc-render-method//issues/svgrenderingtemplate2023) [/w3c-ccg.github.io/multibase/#tv-base58](https://github.com//w3c-ccg.github.io/multibase//issues/tv-base58) [#123](https://github.com/uport-project/veramo/issues/123)
- adds traceability interop default context ([a5418e4](https://github.com/uport-project/veramo/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- bitstring status list entry ([0d1149f](https://github.com/uport-project/veramo/commit/0d1149f048f8e853bfd6bda4b0c99871ef76d8ed))
- credential router ([#139](https://github.com/uport-project/veramo/issues/139)) ([c5e9f1c](https://github.com/uport-project/veramo/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- dockerise vckit api ([#168](https://github.com/uport-project/veramo/issues/168)) ([2d3609b](https://github.com/uport-project/veramo/commit/2d3609b4e4b1c4ce4f82ac4ecbfc60b7bd17b446)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- enveloping proof ([#207](https://github.com/uport-project/veramo/issues/207)) ([998356b](https://github.com/uport-project/veramo/commit/998356b0823610f95b557910a3bcb04567f25a15)), closes [3332/credentials/status/bitstring-status-list/5#0](https://github.com/3332/credentials/status/bitstring-status-list/5/issues/0) [#123](https://github.com/uport-project/veramo/issues/123)
- implement merkle disclosure proof 2021 ([#157](https://github.com/uport-project/veramo/issues/157)) ([6c7d2ed](https://github.com/uport-project/veramo/commit/6c7d2edbf65a7c3aa0b84e8faaf0da3a36de268f)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- implement OAuth middleware for express API ([93613f7](https://github.com/uport-project/veramo/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer plugin ([d50fa4a](https://github.com/uport-project/veramo/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- implement the encrypted storage plugin ([#135](https://github.com/uport-project/veramo/issues/135)) ([3f4b03e](https://github.com/uport-project/veramo/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- implement vc api v2 in open api ([#178](https://github.com/uport-project/veramo/issues/178)) ([db8b185](https://github.com/uport-project/veramo/commit/db8b1858b62b7e307052ad870ee43c96dcbbb439)), closes [function#V1](https://github.com/function/issues/V1) [function#V2](https://github.com/function/issues/V2) [#123](https://github.com/uport-project/veramo/issues/123)
- vc api for the holder and the verifier ([#107](https://github.com/uport-project/veramo/issues/107)) ([022fb56](https://github.com/uport-project/veramo/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uport-project/veramo/issues/123)
- vc-api issuer interfaces ([#98](https://github.com/uport-project/veramo/issues/98)) ([eddb0c9](https://github.com/uport-project/veramo/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uport-project/veramo/issues/92)

# [](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.7) (2023-10-11)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))

### Features

- adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)

# [](https://github.com/uncefact/project-vckit/compare/v1.0.0-beta.2...v1.0.0-beta.6) (2023-10-09)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uncefact/project-vckit/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add missing plugin schema ([#97](https://github.com/uncefact/project-vckit/issues/97)) ([78cd8fa](https://github.com/uncefact/project-vckit/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- cd script ([#155](https://github.com/uncefact/project-vckit/issues/155)) ([4345d98](https://github.com/uncefact/project-vckit/commit/4345d98091f7e5dd6a6295b11bf856210cca7bda)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- minor issues ([#153](https://github.com/uncefact/project-vckit/issues/153)) ([cf8c801](https://github.com/uncefact/project-vckit/commit/cf8c8015f75b50d408dd97fefa3e6e3a6e8f7565)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- rendering issue ([#148](https://github.com/uncefact/project-vckit/issues/148)) ([c8bb087](https://github.com/uncefact/project-vckit/commit/c8bb0870a2fdede9976eb8b47ef5db80015bae11)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uncefact/project-vckit/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uncefact/project-vckit/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uncefact/project-vckit/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))

### Features

- adds traceability interop default context ([a5418e4](https://github.com/uncefact/project-vckit/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- credential router ([#139](https://github.com/uncefact/project-vckit/issues/139)) ([c5e9f1c](https://github.com/uncefact/project-vckit/commit/c5e9f1c3a44480c8734ef2b61e232d179ef78889)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- implement OAuth middleware for express API ([93613f7](https://github.com/uncefact/project-vckit/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer plugin ([d50fa4a](https://github.com/uncefact/project-vckit/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- implement the encrypted storage plugin ([#135](https://github.com/uncefact/project-vckit/issues/135)) ([3f4b03e](https://github.com/uncefact/project-vckit/commit/3f4b03e3b6c72666f93f12046472c79ccf9149b1)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc api for the holder and the verifier ([#107](https://github.com/uncefact/project-vckit/issues/107)) ([022fb56](https://github.com/uncefact/project-vckit/commit/022fb56da58eff6b46258dbda0e8a2f9dd708331)), closes [#123](https://github.com/uncefact/project-vckit/issues/123)
- vc-api issuer interfaces ([#98](https://github.com/uncefact/project-vckit/issues/98)) ([eddb0c9](https://github.com/uncefact/project-vckit/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uncefact/project-vckit/issues/92)

# [1.0.0-beta.5](https://github.com/uport-project/veramo/compare/v1.0.0-beta.2...v1.0.0-beta.5) (2023-06-22)

### Bug Fixes

- add correct api-doc router to default config ([df23ed4](https://github.com/uport-project/veramo/commit/df23ed46636e64fc9595a5856abb7e5342f738cc))
- add missing plugin schema ([#97](https://github.com/uport-project/veramo/issues/97)) ([78cd8fa](https://github.com/uport-project/veramo/commit/78cd8faeeb959afc469b7fbfd7cdb09391f71033))
- resolves discrepancy between config and installed packages ([3c65cb6](https://github.com/uport-project/veramo/commit/3c65cb62051d8a85d57acca7e3e6f1e019a0162c))
- update config for credential oa plugin ([100b35d](https://github.com/uport-project/veramo/commit/100b35dba3299e71cf3c09b1de6d8247cd649161))
- update config for renderer plugin ([ca1a03e](https://github.com/uport-project/veramo/commit/ca1a03e24487a3fb2a3702c354140b28bf83ecc0))

### Features

- adds traceability interop default context ([a5418e4](https://github.com/uport-project/veramo/commit/a5418e4ab74ab811079a72effe6036093d4c4403))
- implement OAuth middleware for express API ([93613f7](https://github.com/uport-project/veramo/commit/93613f719fed03892ab8ec1eb4a6113e525c383d))
- implement renderer plugin ([d50fa4a](https://github.com/uport-project/veramo/commit/d50fa4a67912643c1e904b79206e703340f63ffc))
- vc-api issuer interfaces ([#98](https://github.com/uport-project/veramo/issues/98)) ([eddb0c9](https://github.com/uport-project/veramo/commit/eddb0c931a55c69efeae8aa52d841127b7c15b3e)), closes [#92](https://github.com/uport-project/veramo/issues/92)

# [1.0.0-beta.4](https://github.com/uport-project/veramo/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2023-06-04)

### Features

- adds traceability interop default context ([f3783f0](https://github.com/uport-project/veramo/commit/f3783f09cfd9cc9aa55591b98d5ce3e92b1575be))

# [1.0.0-beta.3](https://github.com/uport-project/veramo/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2023-06-02)

**Note:** Version bump only for package @vckit/cli

# [1.0.0-beta.2](https://github.com/uport-project/veramo/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2023-05-11)

**Note:** Version bump only for package @vckit/cli

# [1.0.0-beta.1](https://github.com/uport-project/veramo/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2023-05-10)

**Note:** Version bump only for package @vckit/cli

# [1.0.0-beta.0](https://github.com/uport-project/veramo/compare/v0.3.0...v1.0.0-beta.0) (2023-05-09)

**Note:** Version bump only for package @vckit/cli

# [0.3.0](https://github.com/uport-project/veramo/compare/v0.2.2...v0.3.0) (2023-05-05)

### Features

- add wallet app to default config ([0372201](https://github.com/uport-project/veramo/commit/0372201cf40bd1b0bee41f187bfccaada8694c38))

## [0.2.2](https://github.com/uport-project/veramo/compare/v0.2.1...v0.2.2) (2023-05-03)

**Note:** Version bump only for package @vckit/cli

## [0.2.1](https://github.com/uport-project/veramo/compare/v0.2.0...v0.2.1) (2023-05-02)

**Note:** Version bump only for package @vckit/cli

# 0.2.0 (2023-05-02)

### Features

- init base cli ([50fa0c0](https://github.com/uport-project/veramo/commit/50fa0c0c96c4568bd534999d67235cb6dad41746))
