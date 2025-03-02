# Bitstring Status List

This plugin implement the bitstring status list https://w3c.github.io/vc-bitstring-status-list/ for Verifiable Credentials. It follows the Veramo plugin architecture.

## Installation

Add the plugin to your agent:

- Configure the database for bitstring status list and the bitstring status list plugin

```yaml
dbConnectionBitstringStatusList:
  $require: typeorm#DataSource
  $args:
    - type: sqlite
      database:
        $ref: /constants/databaseFile
      synchronize: false
      migrationsRun: true
      migrations:
        $require: '@uncefact/vckit-bitstring-status-list?t=object#migrations'
      logging: false
      entities:
        $require: '@uncefact/vckit-bitstring-status-list?t=object#Entities'

bitstringStatusList:
  $require: '@uncefact/vckit-bitstring-status-list#BitstringStatusList'
  $args:
    - bitstringDomainURL: http://localhost:3332
      dbConnection:
        $ref: /dbConnectionBitstringStatusList
```

- Add the plugin to your agent

```yaml
agent:
  $require: '@veramo/core#Agent'
  $args:
    - schemaValidation: false
      plugins:
        ...
        - $ref: /bitstringStatusList
        - $require: '@veramo/credential-status#CredentialStatusPlugin'
          $args:
            - BitstringStatusListEntry:
                $require: '@uncefact/vckit-bitstring-status-list?t=object#checkStatus'
```

- Add the plugin to the vckit server

```yaml
server:
  baseUrl:
    $ref: /constants/baseUrl
  port:
    $ref: /constants/port
  use:
   ...
    - - /credentials/status/bitstring-status-list
      - $require: '@uncefact/vckit-bitstring-status-list?t=function#bitstringStatusListRouter'
```

- Add the methods to the vckit server

```yaml
constants:
  ...
  methods:
    ...
    - issueBitstringStatusList
    - checkBitstringStatus
    - setBitstringStatus
```

## Usage

### Request a bitstring status list

```cURL
curl -X POST "http://localhost:3332/agent/issueBitstringStatusList" \
 -H "accept: application/json; charset=utf-8"\
 -H "content-type: application/json" \
 -d '{"statusPurpose":"revocation","bitstringStatusIssuer":"did:web:example.com"}' \
```

Response:

```json
{
  "id": "http://localhost:3332/credentials/status/bitstring-status-list/1#0",
  "type": "BitstringStatusListEntry",
  "statusPurpose": "revocation",
  "statusListIndex": 0,
  "statusListCredential": "http://localhost:3332/credentials/status/bitstring-status-list/1"
}
```

### Check a bitstring status list

**Note:** This API is exposed to developers to check the status of a credential. The correct usage is checking the status of a credential through the VC verifying of VCkit that will check the verifiable credential and the status of the credential.

```cURL
curl -X POST "http://localhost:3332/agent/checkBitstringStatus" \
 -H "accept: application/json; charset=utf-8"\
 -H "content-type: application/json" \
 -d '{"verifiableCredential":{"issuanceDate":"2024-04-17T10:25:11.124Z","@context":["https://www.w3.org/2018/credentials/v1","https://www.w3.org/2018/credentials/examples/v1","https://w3id.org/security/suites/jws-2020/v1"],"type":["VerifiableCredential","UniversityDegreeCredential"],"credentialSubject":{"id":"did:example:ebfeb1f712ebc6f1c276e12ec21","name":"Jane Smith","degree":{"type":"BachelorDegree","name":"Bachelor of Science and Arts","degreeSchool":"Example University"}},"@type":"WebRenderingTemplate2022"}],"issuer":{"id":"did:web:example.com"},"credentialStatus":{"id":"http://localhost:3332/credentials/status/bitstring-status-list/1#0","type":"BitstringStatusListEntry","statusPurpose":"revocation","statusListIndex":0,"statusListCredential":"http://localhost:3332/credentials/status/bitstring-status-list/1"},"proof":{"type":"JsonWebSignature2020","created":"2024-04-19T03:30:07Z","verificationMethod":"did:web:example.com#e9bc8c0d327897fc70f6d9dea05d1e103b7eca429deba83fc34c2cfde0e81c8f-key-0","proofPurpose":"assertionMethod","jws":"eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..xY0syWgvQda7xiVlq2sC_pEl-eBFXvKzzHjt_9YE3Ek5bAWzGyXw2S60B2kVAQDT9JqAd7AUwRpNCt5LSa12AQ"}}}' \
```

### Set status for a bitstring status list

```cURL
curl -X POST "http://localhost:3332/agent/setBitstringStatus" \
 -H "accept: application/json; charset=utf-8"\
 -H "content-type: application/json" \
 -d '{"statusListCredential":"http://localhost:3332/credentials/status/bitstring-status-list/1","statusListVCIssuer":"did:web:example.com","statusPurpose":"revocation","index":0,"status":true}' \
```
