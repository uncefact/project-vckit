---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---

# Basic Operations

Let's use the API docs at [`http://localhost:3332/api-docs`](http://localhost:3332/api-docs) to try some basic functions.

## Authentication

Based on your agent configuration, you may need to provide an API key to access the API, the configuration for authentication middleware plugin [here](/docs/agent-configuration/config-agent-file#authentication-middleware-plugin). If you have an API key, you can add it to the request header for every request like this:

```curl
curl 'http://localhost:3332/agent/didManagerFind' \
  -H 'Authorization: Bearer your_api_key' \
  --data-raw '{}'
```

Or if you try with the API docs, you can add the API key to the [Authentication section](http://localhost:3332/api-docs#auth)

![Authentication section](/img/authentication-section.png)

## Create identifier

### [Optional] Using https for localhost by using ngrok

To try this locally, you need to create a secure tunnel to your `localhost:3332`(the VCkit API server). You can use [**ngrok**](https://ngrok.com/) to do this. After you have installed and registered ngrok, you can run this command to create a secure tunnel to your localhost.

```bash
ngrok http 3332
```

![ngrok](/img/ngrok.png)

### Create a DID web

To create an identifier, we use this [`/didManagerCreate`](http://localhost:3332/api-docs#post-/didManagerCreate) endpoint.

#### Request body:

```json
{
  "alias": "example.com", //replace by your domain
  "provider": "did:web", //you can use other providers, in this case we use did:web
  "kms": "local",
  "options": {
    "keyType": "Ed25519"
  }
}
```

The `alias` is the domain name that you will store a [DID document](/docs/get-started/api-server-get-started/basic-operations#did-document) for your DID web after creation, your domain must be enabled with HTTPS. Or you can choose the easy way by using the ngrok domain that you created in the previous optional step to create your local DID web, with DID document is generated automatically. But the ngrok domain will be expired after a while, so the DID web will be invalid.

```json
{
  "alias": "e3a8-42-117-186-253.ngrok-free.app", // Your ngrok domain
  "provider": "did:web",
  "kms": "local",
  "options": {
    "keyType": "Ed25519"
  }
}
```

#### Expected response:

```json
{
  "did": "did:web:example.com",
  "controllerKeyId": "b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e",
  "keys": [
    {
      "type": "Ed25519",
      "kid": "b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e",
      "publicKeyHex": "b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e",
      "meta": {
        "algorithms": ["EdDSA", "Ed25519"]
      },
      "kms": "local"
    }
  ],
  "services": [],
  "provider": "did:web",
  "alias": "example.com"
}
```

### DID document

After creating your DID web, you need to generate a DID document for your domain by this API

```curl
# Request
curl --location 'localhost:3332/.well-known/did.json' \
--header 'Host: example.com'
```

```jsonc
# Response
{
    "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": "did:web:example.com",
    "verificationMethod": [
        {
            "id": "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-0",
            "type": "JsonWebKey2020",
            "controller": "did:web:example.com",
            "publicKeyJwk": {
                "kty": "OKP",
                "crv": "Ed25519",
                "x": "sRFBatRait94T8quf3rJOdigzwB-rpnt76Mzk7GLHR4"
            }
        },
        {
            "id": "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-1",
            "type": "JsonWebKey2020",
            "controller": "did:web:example.com",
            "publicKeyJwk": {
                "kty": "OKP",
                "crv": "X25519",
                "x": "BnKiBQSLJTWOoGaAeWiKxwTprxnJuhY5ijr8lY3n6FU"
            }
        }
    ],
    "authentication": [
        "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-0",
        "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-1"
    ],
    "assertionMethod": [
        "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-0",
        "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-1"
    ],
    "keyAgreement": [],
    "service": []
}
```

After you have the DID document, you need to deploy it to your domain with the path `/.well-known/did.json`.

## Issue a VC

To issue a VC, we use this endpoint [`/createVerifiableCredential`](http://localhost:3332/api-docs/#post-/createVerifiableCredential).

### Request body:

Copy the issuer id from last step, then replace the issuer.id in the request by it.

```json
{
  "credential": {
    "issuanceDate": "2024-04-19T03:24:09.927Z",
    "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1", "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"],
    "type": ["VerifiableCredential", "UniversityDegreeCredential"],
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
      "id": "did:web:example.com"
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
  "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1", "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"],
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
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
    "id": "did:web:example.com"
  },
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2024-04-19T03:25:52Z",
    "verificationMethod": "did:web:example.com#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
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
    "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1", "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"],
    "type": ["VerifiableCredential", "UniversityDegreeCredential"],
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
      "id": "did:web:example.com"
    },
    "proof": {
      "type": "Ed25519Signature2018",
      "created": "2024-04-19T03:25:52Z",
      "verificationMethod": "did:web:example.com#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
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
        "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1", "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"],
        "type": "Ed25519Signature2018",
        "created": "2024-04-19T03:25:52Z",
        "verificationMethod": "did:web:example.com#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Oha3rvy0-aqPBcwwGIWMYHvNd_37y4Cuf9krKkprbyeUsn0ZpQ-wE7n8liSj6kecKMQQceM4htkuC1yWVCF1DA"
      },
      "verified": true,
      "verificationMethod": {
        "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/ed25519-2018/v1", "https://w3id.org/security/suites/x25519-2019/v1"],
        "id": "did:web:example.com#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
        "type": "Ed25519VerificationKey2018",
        "controller": {
          "id": "did:web:example.com#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED"
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

This feature is handled by VCkit Renderer plugin, check it out in the npm [here](https://www.npmjs.com/package/@vckit/renderer).

To get the rendered VC, you can try this endpoint [`/renderCredential`](http://localhost:3332/api-docs/#post-/renderCredential).

### Request body:

```json
{
  "credential": {
    "issuanceDate": "2024-04-19T03:24:09.927Z",
    "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1", "https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json"],
    "type": ["VerifiableCredential", "UniversityDegreeCredential"],
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
      "id": "did:web:example.com"
    },
    "proof": {
      "type": "Ed25519Signature2018",
      "created": "2024-04-19T03:25:52Z",
      "verificationMethod": "did:web:example.com#z6MkrUzzgZdYToqpqcpK2wrTmsdPtGXLBnJrZ4mVUjetBUED",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Oha3rvy0-aqPBcwwGIWMYHvNd_37y4Cuf9krKkprbyeUsn0ZpQ-wE7n8liSj6kecKMQQceM4htkuC1yWVCF1DA"
    }
  }
}
```

### Expected response:

```json
{
  "documents": ["PGRpdiBzdHlsZT0id2lkdGg6MzAwcHg7IGhlaWdodDoxMDBweDsgYm9yZGVyOiAycHggc29saWQgYmxhY2s7IHRleHQtYWxpZ246Y2VudGVyIj4KICA8ZGl2PgogICAgVGhpcyBCYWNoZWxvciBvZiBTY2llbmNlIGFuZCBBcnRzIGlzIGNvbmZlcnJlZCB0bwogIDwvZGl2PgogIDxzdHJvbmcgc3R5bGU9ImZvbnQtc2l6ZTogMTZweCI+CiAgICBKYW5lIFNtaXRoCiAgPC9zdHJvbmc+CiAgPGRpdj4KICAgIGJ5IEV4YW1wbGUgVW5pdmVyc2l0eS4KICA8L2Rpdj4KPC9kaXY+"]
}
```

:::tip
The document value is a string which is a encoded HTML string. You can use any online [Base64](https://www.base64decode.org/) tool out there to decode it. Good luck!
:::
