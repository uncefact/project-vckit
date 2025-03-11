---
sidebar_label: 'Crash Course'
sidebar_position: 1
---

import Disclaimer from './../../\_disclaimer.mdx';

# Introduction

<Disclaimer />

Decentralised Identifiers (DIDs) are a new type of identifier that enable verifiable, self-sovereign digital identities. Unlike traditional identifiers (such as email addresses or usernames), DIDs are not controlled by a central authority, allowing decentralised identity management.

A DID typically consists of a URI that resolves to a DID Document, which contains public keys, authentication methods, and service endpoints related to the DID.

### DID Methods

DIDs can be created using various methods (e.g., `did:key`, `did:ethr`, `did:web`), each with different use cases and underlying technologies.

### DID Documents

A DID Document contains cryptographic material and service endpoints. It's stored in a decentralised manner but can be resolved to retrieve relevant information.

## What is did:web?

`did:web` is a DID method that allows you to host a DID Document on a web domain. It's designed for use cases where existing web infrastructure (like domains and HTTPS) can be leveraged to create a decentralised identifier.

### did:web Structure

A `did:web` identifier is constructed based on a domain name. The structure is as follows:

`did:web:<domain>`

For example:

- `did:web:example.com` points to a DID Document hosted at `https://example.com/.well-known/did.json`.
- `did:web:subdomain.example.com` would point to a DID Document at `https://subdomain.example.com/.well-known/did.json`.
- `did:web:subdomain.example.com:users:alice` would point to a DID Document at `https://subdomain.example.com/users/alice/did.json`. In this format, the additional path (users/alice) means the `.well-known` directory is not included, and the DID document is directly under the specified path

### Advantages of did:web

- **Ease of Adoption**: `did:web` requires no special blockchain infrastructure, making it easier for organisations with existing web domains to implement.
- **Decentralised Identity for the Web**: Since it uses the web's existing infrastructure, `did:web` is easily accessible and can leverage tools like TLS and DNS.
- **Ownership Control**: Domain owners maintain complete control over the associated DID by hosting their DID Document.

### Limitations of did:web

- **DNS Dependence**: Since `did:web` relies on the DNS system, it is still somewhat centralised, depending on DNS providers and Certificate Authorities for HTTPS.
- **No Blockchain Backing**: Unlike blockchain-based DID methods, `did:web` does not have cryptographic immutability or tamper-evidence, making it less suited for certain trust-sensitive use cases.

### How did:web Works

1. **Creation of a did:web Identifier**: The DID identifier is derived from the domain name. For example, if you own the domain `example.com`, your DID identifier would be `did:web:example.com`.
2. **Hosting the DID Document**: By default, the DID Document must be hosted in the `.well-known` directory on your domain. For example:

   - `https://example.com/.well-known/did.json`

   However, if you're using a custom path, the document can be hosted at any location on your domain. In this case, the `did:web` identifier would reflect the custom path. For instance, if you host the document at `https://example.com/custom-path/did.json`, your DID identifier would be `did:web:example.com:custom-path`.

3. **MIME Type Requirement**
   When hosting the DID Document, it is essential to serve it with the correct MIME type to ensure that it is recognised and processed correctly by clients. The MIME type for DID documents is:

   - For JSON DID Documents: application/did+json
   - For JSON-LD DID Documents: application/did+ld+json

4. **HTTPS Requirement**: The domain must serve content over HTTPS. This ensures secure and encrypted communication when resolving the DID Document. Hosting it without HTTPS would result in non-compliance with did:web standards.

5. **DID Resolution**: When someone queries the DID (e.g., `did:web:example.com`), the DID resolution process fetches the DID Document from the appropriate path, such as `https://example.com/.well-known/did.json` or a custom path. The DID Document is returned and used for cryptographic operations such as verification and authentication.

### Use Cases for did:web

- Organisations wanting decentralised identity management with existing web domains.
- Projects requiring decentralised identifiers without the complexity of blockchain-based DIDs.
