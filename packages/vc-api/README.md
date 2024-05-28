# vc-api Router

This repository contains an agent router that adheres to the vc-api standard, aiming to achieve interoperability between various parties.

## Usage

The router follows the `veramo` architecture, allowing you to configure it using the `agent.yml` file. Below is an example of how to set up the router with different functionalities:

````yaml
# VC API v1
- - /v1
  - $require: '@vckit/vc-api?t=function#V1VcRouter'
    $args:
      - basePath: :3332

# VC API v2
- - /v2
  - $require: '@vckit/vc-api?t=function#V2VcRouter'
    $args:
      - basePath: :3332

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
      "endpoint": "http://localhost:3332/v1/credentials/issue",
      "method": "POST",
      "tags": ["vc-api", "Ed25519Signature2020"]
    }
  ],
  "verifiers": [
    {
      "id": "DID_WEB",
      "endpoint": "http://localhost:3332/v1/credentials/verify",
      "method": "POST",
      "tags": ["vc-api", "Ed25519Signature2020"]
    }
  ]
}
````

At the moment, Only did:web is supported to configure the verification method to adapt to the test suite. So we will configure the did document to use the `Ed25519VerificationKey2020` verification method. That will be explained in the next steps.

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

4. Modify the keyMapping for key type `Ed25519` to `Ed25519VerificationKey2020` in `agent.yml` because the test suites of vc-api use `Ed25519Signature2020`, so the generating did document need to use the verification method of `Ed25519VerificationKey2020`:

```yaml
# DID Documents
- - $require: '@vckit/remote-server?t=function#WebDidDocRouter'
    $args:
      - keyMapping:
          Ed25519: Ed25519VerificationKey2020 # Ed25519VerificationKey2020 | JsonWebKey2020
```

5. Create a `did:web` by using the API, as shown in the following example using `curl`:

```bash
curl -X POST "http://localhost:3332/agent/didManagerCreate" \
 -H "accept: application/json; charset=utf-8"\
 -H "authorization: Bearer test123"\
 -H "content-type: application/json" \
 -d '{"alias":"ngrok_host","provider":"did:web","kms":"local","options":{"keyType":"Ed25519"}}'

```

Replace `ngrok_host` with the host of your ngrok tunnel on port 3332.

6. Update the implementation file with your newly created `did:web`.

7. Run the test command: `npm run test`.
