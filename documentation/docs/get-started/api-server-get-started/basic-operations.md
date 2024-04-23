---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---
# Basic Operations
Let's use the API docs at [`http://localhost:3332/api-docs`](http://localhost:3332/api-docs) to try some basic functions.
## Create identifier
To create an identifier, we use this [`/didManagerCreate`](http://localhost:3332/api-docs#post-/didManagerCreate) endpoint.
### Request body:
```json
{
  "alias": "exampleDid", //replace by your custom alias
  "provider": "did:key", //you can use other providers, in this case we use did:key
  "kms": "local",
  "options": {}
}
```
### Expected response:
```json
{
  "did": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr", //this is issuer id
  "controllerKeyId": "54254141fdfea3c4c9b0cbce36c2be71de2705cb2967dd65061643223005e723",
  "keys": [
    {
      "type": "Ed25519",
      "kid": "54254141fdfea3c4c9b0cbce36c2be71de2705cb2967dd65061643223005e723",
      "publicKeyHex": "54254141fdfea3c4c9b0cbce36c2be71de2705cb2967dd65061643223005e723",
      "meta": {
        "algorithms": [
          "EdDSA",
          "Ed25519"
        ]
      },
      "kms": "local"
    }
  ],
  "services": [],
  "provider": "did:key",
  "alias": "exampleDid"
}
```
## Issue a VC
To issue a VC, we use this endpoint [`/createVerifiableCredential`](http://localhost:3332/api-docs/#post-/createVerifiableCredential).
### Request body:
Copy the issuer id from last step, then replace the issuer.id in the request by it.
```json
{
    "credential": {
        "issuanceDate": "2024-04-19T03:24:09.927Z",
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
            "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
        ],
        "type": [
            "VerifiableCredential",
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
            "id": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED"
        }
    },
    "proofFormat": "lds",
    "save": true,
    "fetchRemoteContexts": true
}
```
### Expected response:
```json
{
  "issuanceDate": "2024-04-19T03:24:09.927Z",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
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
    "id": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED"
  },
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2024-04-19T03:25:52Z",
    "verificationMethod": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Oha3rvy0-aqPBcwwGIWMYHvNd_37y4Cuf9krKkprbyeUsn0ZpQ-wE7n8liSj6kecKMQQceM4htkuC1yWVCF1DA"
  }
}
```
## Verify a Vc
We use this [`/verifyCredential`](http://localhost:3332/api-docs/#post-/verifyCredential) to verify a VC. You can try with this request body, but remember to replace the **issuer id**, **jwt signature** by yours (check the response of previous steps).
### Request body:
```json
{
"credential": {
  "issuanceDate": "2024-04-19T03:24:09.927Z",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
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
    "id": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED"
  },
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2024-04-19T03:25:52Z",
    "verificationMethod": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Oha3rvy0-aqPBcwwGIWMYHvNd_37y4Cuf9krKkprbyeUsn0ZpQ-wE7n8liSj6kecKMQQceM4htkuC1yWVCF1DA"
  }
}
}
```
### Expected response:
```json
{
  "verified": true,
  "results": [
    {
      "proof": {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1",
          "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
        ],
        "type": "Ed25519Signature2018",
        "created": "2024-04-19T03:25:52Z",
        "verificationMethod": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Oha3rvy0-aqPBcwwGIWMYHvNd_37y4Cuf9krKkprbyeUsn0ZpQ-wE7n8liSj6kecKMQQceM4htkuC1yWVCF1DA"
      },
      "verified": true,
      "verificationMethod": {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          "https://w3id.org/security/suites/ed25519-2018/v1",
          "https://w3id.org/security/suites/x25519-2019/v1"
        ],
        "id": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
        "type": "Ed25519VerificationKey2018",
        "controller": {
          "id": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED"
        },
        "publicKeyBase58": "D2jx6KP78GMMj7ycMNtcvn5Q4hFUmu4Vs3rZeTgsGFSq"
      },
      "purposeResult": {
        "valid": true
      },
      "log": [
        {
          "id": "expiration",
          "valid": true
        },
        {
          "id": "valid_signature",
          "valid": true
        },
        {
          "id": "issuer_did_resolves",
          "valid": true
        },
        {
          "id": "revocation_status",
          "valid": true
        }
      ]
    }
  ],
  "statusResult": {
    "verified": true
  },
  "log": [
    {
      "id": "expiration",
      "valid": true
    },
    {
      "id": "valid_signature",
      "valid": true
    },
    {
      "id": "issuer_did_resolves",
      "valid": true
    },
    {
      "id": "revocation_status",
      "valid": true
    }
  ]
}
```
## Render a Vc
This feature is handled by VCKit Renderer plugin, check it out in the npm [here](https://www.npmjs.com/package/@vckit/renderer).

To get the rendered VC, you can try this endpoint [`/renderCredential`](http://localhost:3332/api-docs/#post-/renderCredential).
### Request body:
```json
{
"credential": {
  "issuanceDate": "2024-04-19T03:24:09.927Z",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
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
    "id": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED"
  },
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2024-04-19T03:25:52Z",
    "verificationMethod": "did:key:z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Oha3rvy0-aqPBcwwGIWMYHvNd_37y4Cuf9krKkprbyeUsn0ZpQ-wE7n8liSj6kecKMQQceM4htkuC1yWVCF1DA"
  }
}
}
```

### Expected response:
```json
{
  "documents": [
    "PGRpdiBzdHlsZT0id2lkdGg6MzAwcHg7IGhlaWdodDoxMDBweDsgYm9yZGVyOiAycHggc29saWQgYmxhY2s7IHRleHQtYWxpZ246Y2VudGVyIj4KICA8ZGl2PgogICAgVGhpcyBCYWNoZWxvciBvZiBTY2llbmNlIGFuZCBBcnRzIGlzIGNvbmZlcnJlZCB0bwogIDwvZGl2PgogIDxzdHJvbmcgc3R5bGU9ImZvbnQtc2l6ZTogMTZweCI+CiAgICBKYW5lIFNtaXRoCiAgPC9zdHJvbmc+CiAgPGRpdj4KICAgIGJ5IEV4YW1wbGUgVW5pdmVyc2l0eS4KICA8L2Rpdj4KPC9kaXY+"
  ]
}
```
:::tip
The document value is a string which is a encoded HTML string. You can use any online [Base64](https://www.base64decode.org/) tool out there to decode it. Good luck!
:::

