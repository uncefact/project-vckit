# vc-api Router

This repository contains an agent router that adheres to the vc-api standard, aiming to achieve interoperability between various parties.

## Usage

The router follows the `veramo` architecture, allowing you to configure it using the `agent.yml` file. Below is an example of how to set up the router with different functionalities:

```yaml
# API base path
- - $require: '@vckit/vc-api?t=function#HolderRouter'
- - $require: '@vckit/vc-api?t=function#IssuerRouter'
    $args:
      - createCredential: createVerifiableCredential
        updateCredentialStatus: updateVerifiableCredentialStatus
- - $require: '@vckit/vc-api?t=function#VerifierRouter'
    $args:
      - verifyCredential: verifyCredential
        verifyPresentation: verifyPresentation

# VC API docs path
- - /vc-api.json
  - $require: '@vckit/vc-api?t=function#VCApiSchemaRouter'
    $args:
      - basePath: :3332

- - /vc-api-docs
  - $require: '@vckit/vc-api?t=function#VCApiDocsRouter'
```

## Test with test-suite

To test the agent router, you can use the vc-api test suite. Follow the steps below:

1. Clone the test suite repositories: vc-api-issuer-test-suite and vc-api-verifier-test-suite.

2. Navigate to node_modules/vc-api-test-suite-implementations/implementations, and create a new implementation file with the following content:

```json
{
  "name": "XYZ",
  "implementation": "Verifiable Credentials",
  "issuers": [
    {
      "id": "DID_WEB",
      "endpoint": "http://localhost:3332/credentials/issue",
      "method": "POST",
      "tags": ["vc-api", "Ed25519Signature2020"]
    }
  ],
  "verifiers": [
    {
      "id": "DID_WEB",
      "endpoint": "http://localhost:3332/credentials/verify",
      "method": "POST",
      "tags": ["vc-api", "Ed25519Signature2020"]
    }
  ]
}
```

3. Modify the W3C credentialPlugin in `agent.yml` to use the appropriate signature suite. For example, if the test suite is using `Ed25519Signature2020`, replace `VeramoEd25519Signature2018` with `VeramoEd25519Signature2020`:

```yaml
# W3C credentialPlugin
credentialIssuerLD:
  $require: '@veramo/credential-ld#CredentialIssuerLD'
  $args:
    - suites:
        - $require: '@veramo/credential-ld#VeramoEd25519Signature2020'
        - $require: '@veramo/credential-ld#VeramoEcdsaSecp256k1RecoverySignature2020'
      contextMaps:
        # The LdDefaultContext is a "catch-all" for now.
        - $require: '@veramo/credential-ld?t=object#LdDefaultContexts'
        - $require: '@transmute/credentials-context?t=object#contexts'
        #  others should be included here
```

4. Create a `did:web` by using the API, as shown in the following example using `curl`:

```bash
curl -X POST "http://localhost:3332/agent/didManagerCreate" \
 -H "accept: application/json; charset=utf-8"\
 -H "authorization: Bearer test123"\
 -H "content-type: application/json" \
 -d '{"alias":"ngrok_host","provider":"did:web","kms":"local","options":{"keyType":"Ed25519"}}'

```

Replace `ngrok_host` with the host of your ngrok tunnel on port 3332.

5. Update the implementation file with your newly created `did:web`.

6. Run the test command: `npm run test`.
