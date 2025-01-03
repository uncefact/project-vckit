import Disclaimer from './../\_disclaimer.mdx';

# Credential Merkle Disclosure Proof

<Disclaimer />

This package get idea from [merkle-disclosure-proof-2021](https://github.com/transmute-industries/merkle-disclosure-proof-2021) and implement to be a plugin for [Veramo](https://veramo.io/). It follows the proposal [Credential Merkle Disclosure Proof](https://w3c-ccg.github.io/Merkle-Disclosure-2021) to generate a Merkle proof from a credential.

## Usage

### Setup

- Declare the plugin in your Veramo agent:

```yaml
   # Merkle Disclosure Proof credentialPlugin
    credentialIssuerMDP:
        $require: '@vckit/credential-merkle-disclosure-proof#CredentialMerkleDisclosureProof'
        $args:
            - suites:
                # - $require: '@veramo/credential-ld#VeramoJsonWebSignature2020'
                - $require: '@vckit/credential-merkle-disclosure-proof#VCKitMerkleDisclosureProof2021'
            contextMaps:
                # The LdDefaultContext is a "catch-all" for now.
                - $require: '@veramo/credential-ld?t=object#LdDefaultContexts'
                - $require: '@transmute/credentials-context?t=object#contexts'
                - $require: '@transmute/did-context?t=object#contexts'
                #  others should be included here
```

- Add the plugin to your Veramo agent:

```yaml
    agent:
        $require: '@veramo/core#Agent'
        $args:
            - schemaValidation: false
            plugins:
                # ... other plugins
                - $ref: /credentialIssuerMDP
```

### Issue a credential

The merkle disclosure proof plugin includes into the credential router plugin. So you can issue a credential through the credential router plugin with the proofFormat `MerkleDisclosureProof2021`. The issuer must be a did:web.

```bash
curl -X POST "http://localhost:3332/agent/routeCreationVerifiableCredential" \
 -H "accept: application/json; charset=utf-8"\
 -H "content-type: application/json" \
 -d '{"credential":{"issuanceDate":"2023-12-25T08:40:25.243Z","@context":["https://www.w3.org/2018/credentials/v1","https://www.w3.org/2018/credentials/v1","https://www.w3.org/2018/credentials/examples/v1","https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"],"type":["VerifiableCredential","VerifiableCredential","UniversityDegreeCredential"],"credentialSubject":{"id":"did:example:ebfeb1f712ebc6f1c276e12ec21","name":"Jane Smith","degree":{"type":"BachelorDegree","name":"Bachelor of Science and Arts","degreeSchool":"Example University"}},"render":[{"template":"<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>","@type":"WebRenderingTemplate2022"}],"issuer":{"id":"did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com"}},"proofFormat":"MerkleDisclosureProof2021","save":true,"fetchRemoteContexts":true}' \

```

### Redact a credential

To redact a credential, you need to provide the credential that was issued with the proofFormat `MerkleDisclosureProof2021` and the credential that you want to redact.

```bash
curl -X POST "http://localhost:3332/agent/redactVerifiableCredential" \
 -H "accept: application/json; charset=utf-8"\
 -H "content-type: application/json" \
 -d '{"inputVerifiableCredential":{"issuanceDate":"2023-12-25T08:41:12.129Z","@context":["https://www.w3.org/2018/credentials/v1","https://www.w3.org/2018/credentials/examples/v1","https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json","https://w3id.org/vc-revocation-list-2020/v1"],"type":["VerifiableCredential","UniversityDegreeCredential"],"credentialSubject":{"id":"did:example:ebfeb1f712ebc6f1c276e12ec21","name":"Jane Smith","degree":{"type":"BachelorDegree","name":"Bachelor of Science and Arts","degreeSchool":"Example University"}},"render":[{"template":"<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>","@type":"WebRenderingTemplate2022"}],"issuer":{"id":"did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com"},"credentialStatus":{"id":"http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11","type":"RevocationList2020Status","revocationListIndex":6,"revocationListCredential":"http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11"},"proof":{"type":"MerkleDisclosureProof2021","created":"2023-12-25T08:41:12.695Z","verificationMethod":"did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com#e9bc8c0d327897fc70f6d9dea05d1e103b7eca429deba83fc34c2cfde0e81c8f-key-0","proofPurpose":"assertionMethod","normalization":"jsonPointer","proofs":"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","jws":"eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19.InR4ZmZIVkpNZVJtdUlrWlNHVlZJZG9vUlpUUHJIVXYyanYydkRyeG1ZT009Ig.Sqr1Kt4UcjBCQjtF32Em2gbwOWAj3SAA0grUpVaDwM5zePjvr8euoJAjhVv9AnxwzyBPjZ47kn4Kdiui5iTvAw"}},"outputCredential":{"issuanceDate":"2023-12-25T08:41:12.129Z","@context":["https://www.w3.org/2018/credentials/v1","https://www.w3.org/2018/credentials/examples/v1","https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json","https://w3id.org/vc-revocation-list-2020/v1"],"type":["VerifiableCredential","UniversityDegreeCredential"],"credentialSubject":{"id":"did:example:ebfeb1f712ebc6f1c276e12ec21","name":"Jane Smith","degree":{"type":"BachelorDegree","name":"Bachelor of Science and Arts"}},"render":[{"template":"<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>","@type":"WebRenderingTemplate2022"}],"issuer":{"id":"did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com"},"credentialStatus":{"id":"http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11","type":"RevocationList2020Status","revocationListIndex":6,"revocationListCredential":"http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11"}}}' \

```

```typescript
// inputVerifiableCredential is the credential that was issued with the proofFormat `MerkleDisclosureProof2021`
    {
    "issuanceDate": "2023-12-25T08:41:12.129Z",
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
      "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json",
      "https://w3id.org/vc-revocation-list-2020/v1"
    ],
    "type": [
      "VerifiableCredential",
      "UniversityDegreeCredential"
    ],
    "credentialSubject": {
      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
      "name": "Jane Smith",
      "degree": {
        "type": "BachelorDegree",
        "name": "Bachelor of Science and Arts",
        "degreeSchool": "Example University"
      }
    },
    "render": [
      {
        "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
        "@type": "WebRenderingTemplate2022"
      }
    ],
    "issuer": {
      "id": "did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com"
    },
    "credentialStatus": {
      "id": "http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11",
      "type": "RevocationList2020Status",
      "revocationListIndex": 6,
      "revocationListCredential": "http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11"
    },
    "proof": {
      "type": "MerkleDisclosureProof2021",
      "created": "2023-12-25T08:41:12.695Z",
      "verificationMethod": "did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com#e9bc8c0d327897fc70f6d9dea05d1e103b7eca429deba83fc34c2cfde0e81c8f-key-0",
      "proofPurpose": "assertionMethod",
      "normalization": "jsonPointer",
      "proofs": "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",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19.InR4ZmZIVkpNZVJtdUlrWlNHVlZJZG9vUlpUUHJIVXYyanYydkRyeG1ZT009Ig.Sqr1Kt4UcjBCQjtF32Em2gbwOWAj3SAA0grUpVaDwM5zePjvr8euoJAjhVv9AnxwzyBPjZ47kn4Kdiui5iTvAw"
    }
  }

// outputCredential is that credential but it is redact the degreeSchool field and remove the proof
{
    "issuanceDate": "2023-12-25T08:41:12.129Z",
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
      "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json",
      "https://w3id.org/vc-revocation-list-2020/v1"
    ],
    "type": [
      "VerifiableCredential",
      "UniversityDegreeCredential"
    ],
    "credentialSubject": {
      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
      "name": "Jane Smith",
      "degree": {
        "type": "BachelorDegree",
        "name": "Bachelor of Science and Arts"
      }
    },
    "render": [
      {
        "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
        "@type": "WebRenderingTemplate2022"
      }
    ],
    "issuer": {
      "id": "did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com"
    },
    "credentialStatus": {
      "id": "http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11",
      "type": "RevocationList2020Status",
      "revocationListIndex": 6,
      "revocationListCredential": "http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11"
    }
  }
```

### Verify a credential

The merkle disclosure proof plugin includes into the credential router plugin. So you can verify a credential through the credential router.

```bash
curl -X POST "http://localhost:3332/agent/routeVerificationCredential" \
 -H "accept: application/json; charset=utf-8"\
 -H "content-type: application/json" \
 -d '{"credential":{"issuanceDate":"2023-12-25T08:41:12.129Z","@context":["https://www.w3.org/2018/credentials/v1","https://www.w3.org/2018/credentials/examples/v1","https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json","https://w3id.org/vc-revocation-list-2020/v1"],"type":["VerifiableCredential","UniversityDegreeCredential"],"credentialSubject":{"id":"did:example:ebfeb1f712ebc6f1c276e12ec21","name":"Jane Smith","degree":{"type":"BachelorDegree","name":"Bachelor of Science and Arts"}},"render":[{"template":"<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>","@type":"WebRenderingTemplate2022"}],"issuer":{"id":"did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com"},"credentialStatus":{"id":"http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11","type":"RevocationList2020Status","revocationListIndex":6,"revocationListCredential":"http://localhost:3332/credentials/status/revocation-list-2020/did_web_agtrace-passports.s3.ap-southeast-2.amazonaws.com/11"},"proof":{"type":"MerkleDisclosureProof2021","created":"2023-12-25T08:41:12.695Z","verificationMethod":"did:web:agtrace-passports.s3.ap-southeast-2.amazonaws.com#e9bc8c0d327897fc70f6d9dea05d1e103b7eca429deba83fc34c2cfde0e81c8f-key-0","proofPurpose":"assertionMethod","normalization":"jsonPointer","proofs":"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","jws":"eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19.InR4ZmZIVkpNZVJtdUlrWlNHVlZJZG9vUlpUUHJIVXYyanYydkRyeG1ZT009Ig.Sqr1Kt4UcjBCQjtF32Em2gbwOWAj3SAA0grUpVaDwM5zePjvr8euoJAjhVv9AnxwzyBPjZ47kn4Kdiui5iTvAw"}},"fetchRemoteContexts":true,"policies":{"credentialStatus":true}}' \
```
