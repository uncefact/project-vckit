---
sidebar_label: 'Using Your Own Domain or Ngrok'
sidebar_position: 2
---

import Disclaimer from './../../../\_disclaimer.mdx';

# Create and Host a did:web Identifier

<Disclaimer />

## Section 1: Domain Setup and Importance of HTTPS

### Why HTTPS is Essential

For `did:web` identifiers, it's crucial that your domain is HTTPS-enabled. The DID method `did:web` relies on web infrastructure to serve the DID Document from a domain. Without HTTPS, your DID Document won't be considered secure or verifiable by external services and clients.

Most browsers and services enforce HTTPS to ensure that data exchanged between servers and users remains encrypted and protected from interception.

### Preparing Your Domain

To create a `did:web`, you'll need:

- A registered domain (e.g., `example.com`).
- The ability to host files on that domain.
- HTTPS enabled on your domain, typically via SSL certificates (e.g., via Let's Encrypt or other providers).

Once your domain is set up with HTTPS, you can proceed to create and host your `did:web` identifier.

#### Alternative: Testing with Ngrok (Without a Domain)

If you don't have a domain but want to test the process locally, you can use [**ngrok**](https://ngrok.com/download) to create a secure HTTPS tunnel to your localhost. Ngrok temporarily exposes your local server to the internet, giving you a unique URL for testing.

**Steps to Use Ngrok:**

1. Install and register [**ngrok**](https://ngrok.com/download).
2. Run the following command to create a secure tunnel to your `localhost:3332` (VCkit API server):

   ```bash
   ngrok http 3332
   ```

## Section 2: Creating a `did:web` and DID Document

In this guide, we'll use the VCkit API server to create a `did:web` identifier. Before proceeding, ensure that you have the API server set up and running. **[Go here to set up the API server](/docs/get-started/api-server-get-started/installation)**

Additionally, you will need to authenticate with the API server to make the necessary requests. **[Go here for how to authenticate](/docs/get-started/api-server-get-started/basic-operations#authentication)**

Once your API server is running, you can follow the steps below to create and host your `did:web` identifier.

To create a `did:web` identifier, you’ll use the VCkit API to generate a DID and the corresponding DID Document. This can later be hosted on your own domain or tested using a tunneling service like **ngrok**.

### Create a DID:web Identifier

Use the [`/didManagerCreate`](http://localhost:3332/api-docs#post-/didManagerCreate) endpoint to create a `did:web` identifier.

#### Request Body Example:

```json
{
  "alias": "example.com", //replace with your domain
  "provider": "did:web",
  "kms": "local",
  "options": {
    "keyType": "Ed25519"
  }
}
```

- **alias**: Your domain name, or use the Ngrok URL (e.g., e3a8-42-117-186-253.ngrok-free.app) for local testing.
- **provider**: Set to did:web for this example.
- **kms**: Key management system, set to "local".
- **keyType**: Use the Ed25519 key type.

#### Response Body Example:

```
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
  "provider": "did:web",
  "alias": "example.com"
}
```

### Generate the DID Document

After creating your DID
, you need to generate the corresponding DID document, which must be hosted on your HTTPS-enabled domain or served via your Ngrok URL.

#### Example CURL Request:

```
curl --location 'localhost:3332/.well-known/did.json' \
--header 'Host: example.com' # or ngrok URL if testing locally
```

#### Example DID Document Response:

```
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:web:example.com", // or ngrok URL if testing locally
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
    }
  ],
  "authentication": [
    "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-0"
  ]
}
```

Once generated, the DID document needs to be placed at the following path:

- **For domain**: `https://example.com/.well-known/did.json`
- **For Ngrok:** VCKit automatically serves the DID document at `http://localhost:3332/.well-known/did.json`. Since Ngrok points to your local server, you can access the DID document at `https://e3a8-42-117-186-253.ngrok-free.app/.well-known/did.json` for external testing. VCKit retrieves the domain from the Host header to determine which did:web to resolve, ensuring the correct DID document is served for your domain or Ngrok URL.

:::important
If you are using an additional path in your DID (e.g., did:web:example.com:subpath), you must not use /.well-known. Instead, host the DID document directly at the additional path, like so: `https://example.com/subpath/did.json`
:::

### Serving the DID Document with the Correct MIME Type

When hosting your DID document (e.g., at `/.well-known/did.json`), it's essential to ensure the document is served with the correct MIME type. The appropriate MIME type ensures that clients and verifiers can correctly process your DID document.

#### Correct MIME Type for DID Documents

The recommended MIME type depends on the format of your DID document:

- **For JSON DID Documents**: Use `application/did+json`.
- **For JSON-LD DID Documents**: Use `application/did+ld+json`.
