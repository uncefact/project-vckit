---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---
# Basic Operations
Let's use the API docs at `http://localhost:3332/api-docs` to try some basic functions.
## Create identifier
To create an identifier, we use this `/didManagerCreate` endpoint.
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
To issue a VC, we use this endpoint `/createVerifiableCredential`.
### Request body:
Copy the issuer id from last step, you're gonna need it in this step.
```json
{
  "credential": {
    "issuanceDate": "2024-04-09T03:04:37.767Z",
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
        //template for the renderer
      {
        "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
        "@type": "WebRenderingTemplate2022"
      }
    ],
    "issuer": {
        //paste the issuer id here
      "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
    }
  },
  "proofFormat": "jwt",
  "save": true,
  "fetchRemoteContexts": true
}
```
### Expected response:
```json
{
  "render": [
    {
      "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
      "@type": "WebRenderingTemplate2022"
    }
  ],
  "credentialSubject": {
    "name": "Jane Smith",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science and Arts",
      "degreeSchool": "Example University"
    },
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21"
  },
  "issuer": {
    "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
  },
  "type": [
    "VerifiableCredential",
    "UniversityDegreeCredential"
  ],
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
  ],
  "issuanceDate": "2024-04-09T03:04:37.000Z",
  "proof": {
    "type": "JwtProof2020",
    "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL2V4YW1wbGVzL3YxIiwiaHR0cHM6Ly92Y2tpdC1jb250ZXh0cy5zMy5hcC1zb3V0aGVhc3QtMi5hbWF6b25hd3MuY29tL2Rldi1yZW5kZXItbWV0aG9kLWNvbnRleHQuanNvbiJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibmFtZSI6IkphbmUgU21pdGgiLCJkZWdyZWUiOnsidHlwZSI6IkJhY2hlbG9yRGVncmVlIiwibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiLCJkZWdyZWVTY2hvb2wiOiJFeGFtcGxlIFVuaXZlcnNpdHkifX19LCJyZW5kZXIiOlt7InRlbXBsYXRlIjoiPGRpdiBzdHlsZT1cIndpZHRoOjMwMHB4OyBoZWlnaHQ6MTAwcHg7IGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOyB0ZXh0LWFsaWduOmNlbnRlclwiPlxuICA8ZGl2PlxuICAgIFRoaXMge3tjcmVkZW50aWFsU3ViamVjdC5kZWdyZWUubmFtZX19IGlzIGNvbmZlcnJlZCB0b1xuICA8L2Rpdj5cbiAgPHN0cm9uZyBzdHlsZT1cImZvbnQtc2l6ZTogMTZweFwiPlxuICAgIHt7Y3JlZGVudGlhbFN1YmplY3QubmFtZX19XG4gIDwvc3Ryb25nPlxuICA8ZGl2PlxuICAgIGJ5IHt7Y3JlZGVudGlhbFN1YmplY3QuZGVncmVlLmRlZ3JlZVNjaG9vbH19LlxuICA8L2Rpdj5cbjwvZGl2PiIsIkB0eXBlIjoiV2ViUmVuZGVyaW5nVGVtcGxhdGUyMDIyIn1dLCJzdWIiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEiLCJuYmYiOjE3MTI2MzE4NzcsImlzcyI6ImRpZDprZXk6ejZNa2s3akV1UDVGalRNSHFaNUtWOW1leVlLbU1zb21SQVpHOHFtTjJBaFZ1QnpyIn0.8kJVJxZuDw57eVyasWrPR3m2u4HV1sIwyqCc4wlUsNSKxIwq17CXmDLnOqn9NNN43_v6qRiSkD2Mud5yiRryAA"
  }
}
```
## Verify a Vc
We use this `/verifyCredential` to verify a VC. You can try with this request body, but remember to replace the **issuer id**, **jwt signature** by yours (check the response of previous steps).
### Request body:
```json
{
  "credential": {
  "render": [
    {
      "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
      "@type": "WebRenderingTemplate2022"
    }
  ],
  "credentialSubject": {
    "name": "Jane Smith",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science and Arts",
      "degreeSchool": "Example University"
    },
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21"
  },
  "issuer": {
    //replace this issuer id
    "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
  },
  "type": [
    "VerifiableCredential",
    "UniversityDegreeCredential"
  ],
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
  ],
  "issuanceDate": "2024-04-09T03:04:37.000Z",
  "proof": {
    "type": "JwtProof2020",
    //replace this jwt signature
    "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL2V4YW1wbGVzL3YxIiwiaHR0cHM6Ly92Y2tpdC1jb250ZXh0cy5zMy5hcC1zb3V0aGVhc3QtMi5hbWF6b25hd3MuY29tL2Rldi1yZW5kZXItbWV0aG9kLWNvbnRleHQuanNvbiJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibmFtZSI6IkphbmUgU21pdGgiLCJkZWdyZWUiOnsidHlwZSI6IkJhY2hlbG9yRGVncmVlIiwibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiLCJkZWdyZWVTY2hvb2wiOiJFeGFtcGxlIFVuaXZlcnNpdHkifX19LCJyZW5kZXIiOlt7InRlbXBsYXRlIjoiPGRpdiBzdHlsZT1cIndpZHRoOjMwMHB4OyBoZWlnaHQ6MTAwcHg7IGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOyB0ZXh0LWFsaWduOmNlbnRlclwiPlxuICA8ZGl2PlxuICAgIFRoaXMge3tjcmVkZW50aWFsU3ViamVjdC5kZWdyZWUubmFtZX19IGlzIGNvbmZlcnJlZCB0b1xuICA8L2Rpdj5cbiAgPHN0cm9uZyBzdHlsZT1cImZvbnQtc2l6ZTogMTZweFwiPlxuICAgIHt7Y3JlZGVudGlhbFN1YmplY3QubmFtZX19XG4gIDwvc3Ryb25nPlxuICA8ZGl2PlxuICAgIGJ5IHt7Y3JlZGVudGlhbFN1YmplY3QuZGVncmVlLmRlZ3JlZVNjaG9vbH19LlxuICA8L2Rpdj5cbjwvZGl2PiIsIkB0eXBlIjoiV2ViUmVuZGVyaW5nVGVtcGxhdGUyMDIyIn1dLCJzdWIiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEiLCJuYmYiOjE3MTI2MzE4NzcsImlzcyI6ImRpZDprZXk6ejZNa2s3akV1UDVGalRNSHFaNUtWOW1leVlLbU1zb21SQVpHOHFtTjJBaFZ1QnpyIn0.8kJVJxZuDw57eVyasWrPR3m2u4HV1sIwyqCc4wlUsNSKxIwq17CXmDLnOqn9NNN43_v6qRiSkD2Mud5yiRryAA"
  }
},
  "fetchRemoteContexts": false,
  "policies": {
    "now": 0,
    "issuanceDate": false,
    "expirationDate": false,
    "audience": false,
    "credentialStatus": false
  }
}
```
### Expected response:
```json
{
  "verified": true,
  "payload": {
    "vc": {
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
        "name": "Jane Smith",
        "degree": {
          "type": "BachelorDegree",
          "name": "Bachelor of Science and Arts",
          "degreeSchool": "Example University"
        }
      }
    },
    "render": [
      {
        "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
        "@type": "WebRenderingTemplate2022"
      }
    ],
    "sub": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "nbf": 1712631877,
    "iss": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
  },
  "didResolutionResult": {
    "didDocumentMetadata": {},
    "didResolutionMetadata": {},
    "didDocument": {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/ed25519-2018/v1",
        "https://w3id.org/security/suites/x25519-2019/v1"
      ],
      "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr",
      "verificationMethod": [
        {
          "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr#z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr",
          "type": "Ed25519VerificationKey2018",
          "controller": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr",
          "publicKeyBase58": "6fUCK8ppPurpj4Ecoaop8SmmYJXv1HJuSprSBtjUyyDU"
        },
        {
          "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr#z6LSeFuNcSHDVjVxL3Wj3tPpbhNkCxoyjz4wc6j4c9of6oVW",
          "type": "X25519KeyAgreementKey2019",
          "controller": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr",
          "publicKeyBase58": "3ajD68UMQGnDEf8xXEssH7AGMpGs3Ntnj81P7hA8PRik"
        }
      ],
      "assertionMethod": [
        "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr#z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
      ],
      "authentication": [
        "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr#z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
      ],
      "capabilityInvocation": [
        "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr#z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
      ],
      "capabilityDelegation": [
        "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr#z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
      ],
      "keyAgreement": [
        "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr#z6LSeFuNcSHDVjVxL3Wj3tPpbhNkCxoyjz4wc6j4c9of6oVW"
      ]
    }
  },
  "issuer": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr",
  "signer": {
    "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr#z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr",
    "type": "Ed25519VerificationKey2018",
    "controller": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr",
    "publicKeyBase58": "6fUCK8ppPurpj4Ecoaop8SmmYJXv1HJuSprSBtjUyyDU"
  },
  "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL2V4YW1wbGVzL3YxIiwiaHR0cHM6Ly92Y2tpdC1jb250ZXh0cy5zMy5hcC1zb3V0aGVhc3QtMi5hbWF6b25hd3MuY29tL2Rldi1yZW5kZXItbWV0aG9kLWNvbnRleHQuanNvbiJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibmFtZSI6IkphbmUgU21pdGgiLCJkZWdyZWUiOnsidHlwZSI6IkJhY2hlbG9yRGVncmVlIiwibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiLCJkZWdyZWVTY2hvb2wiOiJFeGFtcGxlIFVuaXZlcnNpdHkifX19LCJyZW5kZXIiOlt7InRlbXBsYXRlIjoiPGRpdiBzdHlsZT1cIndpZHRoOjMwMHB4OyBoZWlnaHQ6MTAwcHg7IGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOyB0ZXh0LWFsaWduOmNlbnRlclwiPlxuICA8ZGl2PlxuICAgIFRoaXMge3tjcmVkZW50aWFsU3ViamVjdC5kZWdyZWUubmFtZX19IGlzIGNvbmZlcnJlZCB0b1xuICA8L2Rpdj5cbiAgPHN0cm9uZyBzdHlsZT1cImZvbnQtc2l6ZTogMTZweFwiPlxuICAgIHt7Y3JlZGVudGlhbFN1YmplY3QubmFtZX19XG4gIDwvc3Ryb25nPlxuICA8ZGl2PlxuICAgIGJ5IHt7Y3JlZGVudGlhbFN1YmplY3QuZGVncmVlLmRlZ3JlZVNjaG9vbH19LlxuICA8L2Rpdj5cbjwvZGl2PiIsIkB0eXBlIjoiV2ViUmVuZGVyaW5nVGVtcGxhdGUyMDIyIn1dLCJzdWIiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEiLCJuYmYiOjE3MTI2MzE4NzcsImlzcyI6ImRpZDprZXk6ejZNa2s3akV1UDVGalRNSHFaNUtWOW1leVlLbU1zb21SQVpHOHFtTjJBaFZ1QnpyIn0.8kJVJxZuDw57eVyasWrPR3m2u4HV1sIwyqCc4wlUsNSKxIwq17CXmDLnOqn9NNN43_v6qRiSkD2Mud5yiRryAA",
  "policies": {
    "now": 0,
    "issuanceDate": false,
    "expirationDate": false,
    "audience": false,
    "credentialStatus": false,
    "nbf": false,
    "iat": false,
    "exp": false,
    "aud": false
  },
  "verifiableCredential": {
    "render": [
      {
        "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
        "@type": "WebRenderingTemplate2022"
      }
    ],
    "credentialSubject": {
      "name": "Jane Smith",
      "degree": {
        "type": "BachelorDegree",
        "name": "Bachelor of Science and Arts",
        "degreeSchool": "Example University"
      },
      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21"
    },
    "issuer": {
      "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
    },
    "type": [
      "VerifiableCredential",
      "UniversityDegreeCredential"
    ],
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
      "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
    ],
    "issuanceDate": "2024-04-09T03:04:37.000Z",
    "proof": {
      "type": "JwtProof2020",
      "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL2V4YW1wbGVzL3YxIiwiaHR0cHM6Ly92Y2tpdC1jb250ZXh0cy5zMy5hcC1zb3V0aGVhc3QtMi5hbWF6b25hd3MuY29tL2Rldi1yZW5kZXItbWV0aG9kLWNvbnRleHQuanNvbiJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibmFtZSI6IkphbmUgU21pdGgiLCJkZWdyZWUiOnsidHlwZSI6IkJhY2hlbG9yRGVncmVlIiwibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiLCJkZWdyZWVTY2hvb2wiOiJFeGFtcGxlIFVuaXZlcnNpdHkifX19LCJyZW5kZXIiOlt7InRlbXBsYXRlIjoiPGRpdiBzdHlsZT1cIndpZHRoOjMwMHB4OyBoZWlnaHQ6MTAwcHg7IGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOyB0ZXh0LWFsaWduOmNlbnRlclwiPlxuICA8ZGl2PlxuICAgIFRoaXMge3tjcmVkZW50aWFsU3ViamVjdC5kZWdyZWUubmFtZX19IGlzIGNvbmZlcnJlZCB0b1xuICA8L2Rpdj5cbiAgPHN0cm9uZyBzdHlsZT1cImZvbnQtc2l6ZTogMTZweFwiPlxuICAgIHt7Y3JlZGVudGlhbFN1YmplY3QubmFtZX19XG4gIDwvc3Ryb25nPlxuICA8ZGl2PlxuICAgIGJ5IHt7Y3JlZGVudGlhbFN1YmplY3QuZGVncmVlLmRlZ3JlZVNjaG9vbH19LlxuICA8L2Rpdj5cbjwvZGl2PiIsIkB0eXBlIjoiV2ViUmVuZGVyaW5nVGVtcGxhdGUyMDIyIn1dLCJzdWIiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEiLCJuYmYiOjE3MTI2MzE4NzcsImlzcyI6ImRpZDprZXk6ejZNa2s3akV1UDVGalRNSHFaNUtWOW1leVlLbU1zb21SQVpHOHFtTjJBaFZ1QnpyIn0.8kJVJxZuDw57eVyasWrPR3m2u4HV1sIwyqCc4wlUsNSKxIwq17CXmDLnOqn9NNN43_v6qRiSkD2Mud5yiRryAA"
    }
  }
}
```
## Render a Vc
To get the rendered VC, you can try this endpoint `/renderCredential`.
### Request body:
```json
{
  "credential": {
  "render": [
    {
      "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
      "@type": "WebRenderingTemplate2022"
    }
  ],
  "credentialSubject": {
    "name": "Jane Smith",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science and Arts",
      "degreeSchool": "Example University"
    },
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21"
  },
  "issuer": {
    "id": "did:key:z6Mkk7jEuP5FjTMHqZ5KV9meyYKmMsomRAZG8qmN2AhVuBzr"
  },
  "type": [
    "VerifiableCredential",
    "UniversityDegreeCredential"
  ],
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"
  ],
  "issuanceDate": "2024-04-09T03:04:37.000Z",
  "proof": {
    "type": "JwtProof2020",
    "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL2V4YW1wbGVzL3YxIiwiaHR0cHM6Ly92Y2tpdC1jb250ZXh0cy5zMy5hcC1zb3V0aGVhc3QtMi5hbWF6b25hd3MuY29tL2Rldi1yZW5kZXItbWV0aG9kLWNvbnRleHQuanNvbiJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibmFtZSI6IkphbmUgU21pdGgiLCJkZWdyZWUiOnsidHlwZSI6IkJhY2hlbG9yRGVncmVlIiwibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiLCJkZWdyZWVTY2hvb2wiOiJFeGFtcGxlIFVuaXZlcnNpdHkifX19LCJyZW5kZXIiOlt7InRlbXBsYXRlIjoiPGRpdiBzdHlsZT1cIndpZHRoOjMwMHB4OyBoZWlnaHQ6MTAwcHg7IGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOyB0ZXh0LWFsaWduOmNlbnRlclwiPlxuICA8ZGl2PlxuICAgIFRoaXMge3tjcmVkZW50aWFsU3ViamVjdC5kZWdyZWUubmFtZX19IGlzIGNvbmZlcnJlZCB0b1xuICA8L2Rpdj5cbiAgPHN0cm9uZyBzdHlsZT1cImZvbnQtc2l6ZTogMTZweFwiPlxuICAgIHt7Y3JlZGVudGlhbFN1YmplY3QubmFtZX19XG4gIDwvc3Ryb25nPlxuICA8ZGl2PlxuICAgIGJ5IHt7Y3JlZGVudGlhbFN1YmplY3QuZGVncmVlLmRlZ3JlZVNjaG9vbH19LlxuICA8L2Rpdj5cbjwvZGl2PiIsIkB0eXBlIjoiV2ViUmVuZGVyaW5nVGVtcGxhdGUyMDIyIn1dLCJzdWIiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEiLCJuYmYiOjE3MTI2MzE4NzcsImlzcyI6ImRpZDprZXk6ejZNa2s3akV1UDVGalRNSHFaNUtWOW1leVlLbU1zb21SQVpHOHFtTjJBaFZ1QnpyIn0.8kJVJxZuDw57eVyasWrPR3m2u4HV1sIwyqCc4wlUsNSKxIwq17CXmDLnOqn9NNN43_v6qRiSkD2Mud5yiRryAA"
  }
},
  "fetchRemoteContexts": false,
  "policies": {
    "now": 0,
    "issuanceDate": false,
    "expirationDate": false,
    "audience": false,
    "credentialStatus": false
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
The document value is a string which is a encoded HTML string. You can use any online [Base64](https://www.base64decode.org/) tool out there to decode it. Good luck!

