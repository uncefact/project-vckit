# vc-api

- This agent router conform to vc-api standard that to achieve interoperability's goal between various parties.

## Usage

- This plugin follow the `veramo` architecture , so you can configure it with `agent.yml` . For example:

```jsx

    - - /vc-api
      - $require: '@vckit/vc-api?t=function#IssuerRouter'
        $args:
          - createCredential: createVerifiableCredential
            updateCredentialStatus: updateVerifiableCredentialStatus
            config:
							proofFormat: OpenAttestationMerkleProofSignature2018
							save: false
      - $require: '@vckit/vc-api?t=function#VerifierRouter'
        $args:
          - verifyCredential: verifyCredential
            verifyPresentation: verifyPresentation
```

## Test with test-suite

- Clone the test suite: https://github.com/w3c-ccg/vc-api-issuer-test-suite and https://github.com/w3c-ccg/vc-api-verifier-test-suite
    
    ```jsx
    {
      "name": "GoSource",
      "implementation": "GoSource Verifiable Credentials",
      "issuers": [{
        "id": "YOUR_DID_MANAGED_BY_YOUR_MKS",
        "endpoint": "http://localhost:3332/issuer/credentials/issue",
        "tags": ["vc-api", "Ed25519Signature2020"]
      }],
      "verifiers": [{
        "id": "YOUR_DID_MANAGED_BY_YOUR_MKS",
        "endpoint": "http://localhost:3332/verifier/credentials/verify",
        "method": "POST",
        "tags": ["vc-api"]
      }]
    }
    ```
    
- Create new implementation file:

- Run the test command `npm run test`
- Test result
- Issuer test result
    
    ```jsx
    ✓ MUST successfully issue a credential.
    ✓ Request body MUST have property "credential".
    ✓ credential MUST have property "@context".
    ✓ credential "@context" MUST be an array.
    ✓ credential "@context" items MUST be strings.
    ✓ credential MUST have property "type"
    ✓ "credential.type" MUST be an array.
    ✓ "credential.type" items MUST be strings
    ✓ credential MUST have property "issuer"
    ✓ "credential.issuer" MUST be a string or an object
    ✓ credential MUST have property "credentialSubject"
    ✓ "credential.credentialSubject" MUST be an object
    ✓ credential MAY have property "expirationDate"
    ```
    
- Verifier test result

```jsx
✓ MUST verify a valid VC.
✓ MUST not verify if "@context" property is missing.
✓ MUST not verify if "type" property is missing.
✓ MUST not verify if "issuer" property is missing.
✓ MUST not verify if "credentialSubject" property is missing.
✓ MUST not verify if "proof" property is missing.
✓ MUST not verify if "proof.type" property is missing.
✓ MUST not verify if "proof.created" property is missing.
✓ MUST not verify if "proof.verificationMethod" property is missing.
✓ MUST not verify if "proof.proofValue" property is missing.
✓ MUST not verify if "proof.proofPurpose" property is missing.
✓ MUST not verify if "@context" is not an array.
✓ MUST not verify if "@context" items are not strings.
✓ MUST not verify if "type" is not an array.
✓ MUST not verify if "type" items are not strings.
✓ MUST not verify if "issuer" is not an object or a string.
✓ MUST not verify if "credentialSubject" is not an object.
✓ MUST not verify if "proof" is not an object.
```