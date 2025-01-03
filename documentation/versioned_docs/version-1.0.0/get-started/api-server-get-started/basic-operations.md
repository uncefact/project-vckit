---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---

import Disclaimer from './../../\_disclaimer.mdx';

# Basic Operations

<Disclaimer />

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

**[Go here to create a `did:web`](/docs/get-started/did-web/how-to-create/hosting-did-web)**

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

## Issuing a status VC

To issue a status VC, use the following VCKit API endpoint: [/agent/issueBitstringStatusList](http://localhost:3332/agent/issueBitstringStatusList).

Once you have the status VC, you can inject it into the issuing VC payload. After issuing a VC with a status VC, the VC can now be revoked or activated, and its status is managed by the VC issuer.

### Request body:

```json
{
	"statusPurpose": "revocation",
	"bitstringStatusIssuer": "did:web:example.com"
}
```

### Expected response:

```json
{
	"id": "http://localhost:3332/credentials/status/bitstring-status-list/26#0",
	"type": "BitstringStatusListEntry",
	"statusPurpose": "revocation",
	"statusListIndex": 0,
	"statusListCredential": "http://localhost:3332/credentials/status/bitstring-status-list/26"
}
```

## Revoking a VC

To revoke a VC, use the following VCKit API endpoint: [/agent/setBitstringStatus](http://localhost:3332/agent/setBitstringStatus).

### Request body:

```json
{
  "statusListCredential": "http://localhost:3332/credentials/status/bitstring-status-list/26",
  "statusListVCIssuer": "did:web:example.com",
  "statusPurpose": "revocation",
  "index": 0,
  "status": true
}
```

### Expected response:

```json
{
  "status": true
}
```

## Activating a VC

To activate a VC, use the following VCKit API endpoint: [/agent/setBitstringStatus](http://localhost:3332/agent/setBitstringStatus).

### Request body:

```json
{
  "statusListCredential": "http://localhost:3332/credentials/status/bitstring-status-list/26",
  "statusListVCIssuer": "did:web:example.com",
  "statusPurpose": "revocation",
  "index": 0,
  "status": false
}
```

### Expected response:

```json
{
  "status": false
}
```