# vc-api agent router

- This agent router conform to vc-api standard that to achieve interoperability's goal between various parties.

## Usage

- This plugin follow the `veramo` architecture , so you can configure it with `agent.yml`

```jsx
# API base path
    - - $require: '@vckit/vc-api?t=function#HolderRouter'
    - - $require: '@vckit/vc-api?t=function#IssuerRouter'
        $args:
          - createCredential: createVerifiableCredential
            updateCredentialStatus: updateVerifiableCredentialStatus
# VC API docs path
    - - /vc-api.json
      - $require: '@vckit/vc-api?t=function#VCApiSchemaRouter'
        $args:
          - basePath: :3332

    - - /vc-api-docs
      - $require: '@vckit/vc-api?t=function#VCApiDocsRouter'
```

## Test with test-suite

- Clone the test suite: https://github.com/w3c-ccg/vc-api-issuer-test-suite
- Go to `node_modules/vc-api-test-suite-implementations/implementations` , create files except the index file
- Create new implementation file:

```jsx
{
  "name": "GoSource",
  "implementation": "GoSource Verifiable Credentials",
  "issuers": [{
    "id": "YOUR_DID_MANAGED_BY_YOUR_KMS",
    "endpoint": "http://localhost:3332/agent/credentials/issue",
    "options": {
      "type": "Ed25519Signature2020"
    },
    "tags": ["vc-api", "Ed25519Signature2020"]
  }]
}
```

- Run the test command `npm run test`
