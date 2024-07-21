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
        # - $require: '@veramo/credential-ld#VeramoEd25519Signature2018'
        # - $require: '@veramo/credential-ld#VeramoEd25519Signature2020'
        # - $require: '@veramo/credential-ld#VeramoJsonWebSignature2020'
        # - $require: '@veramo/credential-ld#VeramoEcdsaSecp256k1RecoverySignature2020'
        - $require: '@vckit/credential-data-integrity#VCkitEddsaRdfc2022'
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

## Verify the credential

You can verify the verifiable credential by using the `/agent/routeVerificationCredential` API endpoint.

The example below shows how to verify the verifiable credential in the example above that using the Data Integrity proof.

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