# Data Integrity Proof Plugin

This package draws inspiration from [eddsa-rdfc-2022-cryptosuite](@digitalbazaar/eddsa-rdfc-2022-cryptosuite) and is implemented as a plugin for [Veramo](https://veramo.io/). It adheres to the [Data Integrity EdDSA Cryptosuites v1.0](https://www.w3.org/TR/vc-di-eddsa/) specification to generate a Data Integrity proof for credentials.

This package contains a plugin and a message handler for issuing and verifying credentials that adhere to W3C standards.

## Setup

- Declare the plugin in your Veramo agent:

```yaml
credentialIssuerLD:
  $require: '@veramo/credential-ld#CredentialIssuerLD'
  $args:
    - suites:
        - $require: '@veramo/credential-ld#VeramoJsonWebSignature2020'
        - $require: '@vckit/credential-data-integrity#VCkitEddsaRdfc2022'
				#  others should be included here
      contextMaps:
        - $require: '@vckit/credential-data-integrity?t=object#contexts'
        - $require: '@veramo/credential-ld?t=object#LdDefaultContexts'
        - $require: '@transmute/credentials-context?t=object#contexts'
        - $require: '@transmute/did-context?t=object#contexts'
        - $require: '@vckit/renderer?t=object#RenderDefaultContexts'
        - $require: '@vckit/revocationlist?t=object#RevocationListDefaultContexts'
        #  others should be included here
```

## Issue the Credential

You can issue a new verifiable credential by using the `/agent/routeCreationVerifiableCredential` API endpoint with the proof format set to `lds`. The issuer can be a `did:web`.

The example below shows how to issue a credential with the Data Integrity proof plugin. You can replace the `issuer` and `credentialSubject` with your own data.

### Verifiable Credential Data Model V1 with Data Integrity Proof Request Payload

```curl
curl --request POST \
  --url http://localhost:3332/agent/routeCreationVerifiableCredential \
  --header 'Content-Type: application/json' \
  --data '{
	"credential": {
		"@context": [
			"https://www.w3.org/2018/credentials/v1",
			"https://w3id.org/security/multikey/v1",
			"https://w3id.org/security/data-integrity/v2"
		],
		"type": [
			"VerifiableCredential"
		],
		"issuer": "did:web:example.com",
		"issuanceDate": "2021-01-01T19:23:24Z",
		"credentialSubject": {
			"id": "did:example:456",
			"name": "John Doe"
		}
	},
	"proofFormat": "lds",
	"save": true,
	"fetchRemoteContexts": true
}'
```

### Verifiable credential data model V2 with Data Integrity proof request payload

```curl
curl --request POST \
  --url http://localhost:3332/agent/routeCreationVerifiableCredential \
  --header 'Content-Type: application/json' \
  --data '{
	"credential": {
		"@context": [
			"https://www.w3.org/ns/credentials/v2",
			"https://w3id.org/security/multikey/v1",
			"https://w3id.org/security/data-integrity/v2"
		],
		"id": "http://university.example/credentials/1872",
		"type": [
			"VerifiableCredential",
			"ExampleAlumniCredential"
		],
		"issuer": "did:web:bb32-115-79-32-109.ngrok-free.app",
		"validFrom": "2010-01-01T19:23:24Z",
		"credentialSchema": {
			"id": "https://example.org/examples/degree.json",
			"type": "JsonSchema"
		},
		"credentialSubject": {
			"id": "did:example:123",
			"degree": {
				"type": "BachelorDegree",
				"name": "Bachelor of Science and Arts"
			}
		}
	},
	"proofFormat": "lds",
	"save": true,
	"fetchRemoteContexts": true
}'
```

## Verify the credential

You can verify the verifiable credential by using the `/agent/routeVerificationCredential` API endpoint.

The examples below show how to verify the verifiable credentials in the examples above using the Data Integrity proof.

### Verifiable Credential Data Model V1 with Data Integrity Proof Verification Request Payload

```curl
curl --request POST \
  --url http://localhost:3332/agent/routeVerificationCredential \
  --header 'Content-Type: application/json' \
  --data '{
	"credential":  {
		"@context": [
			"https://www.w3.org/2018/credentials/v1",
			"https://w3id.org/security/multikey/v1",
			"https://w3id.org/security/data-integrity/v2"
		],
		"type": [
			"VerifiableCredential"
		],
		"issuer": "did:web:bb32-115-79-32-109.ngrok-free.app",
		"issuanceDate": "2021-01-01T19:23:24Z",
		"credentialSubject": {
			"id": "did:example:456",
			"name": "John Doe"
		},
		"proof": {
			"type": "DataIntegrityProof",
			"created": "2024-07-21T15:39:40Z",
			"verificationMethod": "did:web:bb32-115-79-32-109.ngrok-free.app#14fe3440c6d669edd8a63dc92b571fb0973fd4b832444014e69bcf8cebd38853",
			"cryptosuite": "eddsa-rdfc-2022",
			"proofPurpose": "assertionMethod",
			"proofValue": "z2S6qW6k6M6eXuqGkX5vdydqveSNVBSZf46MxxjY5ukv8gL741pos3yywT9mGTjKJzdjxQvaCSSVtCAngoAWQzNnq"
		}
	},
	"fetchRemoteContexts": true
}'
```

### Verifiable Credential Data Model V2 with Data Integrity Proof Verification Request Payload

```curl
curl --request POST \
  --url http://localhost:3332/agent/routeVerificationCredential \
  --header 'Authorization: Bearer kh14g04piduv' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
	"credential": {
		"@context": [
			"https://www.w3.org/ns/credentials/v2",
			"https://w3id.org/security/multikey/v1",
			"https://w3id.org/security/data-integrity/v2"
		],
		"id": "http://university.example/credentials/1872",
		"type": [
			"VerifiableCredential",
			"ExampleAlumniCredential"
		],
		"issuer": "did:web:bb32-115-79-32-109.ngrok-free.app",
		"validFrom": "2010-01-01T19:23:24Z",
		"credentialSchema": {
			"id": "https://example.org/examples/degree.json",
			"type": "JsonSchema"
		},
		"credentialSubject": {
			"id": "did:example:123",
			"degree": {
				"type": "BachelorDegree",
				"name": "Bachelor of Science and Arts"
			}
		},
		"issuanceDate": "2024-07-25T09:25:22.788Z",
		"proof": {
			"type": "DataIntegrityProof",
			"created": "2024-07-25T09:25:23Z",
			"verificationMethod": "did:web:bb32-115-79-32-109.ngrok-free.app#a0b90e4ec2c9fbc63c50f230b98ea8335af1da5bba9472684519ae7da11273d6",
			"cryptosuite": "eddsa-rdfc-2022",
			"proofPurpose": "assertionMethod",
			"proofValue": "zbS3i4uaUzAw1J7Eb544Tgqfo8azhJkx3jGS5wtk4WCBe2CkAZyLEnX7Au7n3anEtTWaG9f283NF2rzJEsxFKjPE"
		}
	},
	"fetchRemoteContexts": true
}'
```
