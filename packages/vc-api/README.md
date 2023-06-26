# vc-api agent router

- This agent router conform to vc-api standard that to achieve interoperability's goal between various parties.

## Usage

- This plugin follow the `veramo` architecture , so you can configure it with `agent.yml`

```jsx
# API base path
    - - /issuer
      - $require: '@vckit/vc-api-issuer?t=function#AgentRouter'
        $args:
          - createCredential: createVerifiableCredential
            updateCredentialStatus: updateVerifiableCredentialStatus
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
