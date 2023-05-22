# project-vckit

A reference implementation of a verifiable credentials platform for digital trade and traceability.  Please review this [verifiable credentials white paper](https://unece.org/sites/default/files/2022-07/WhitePaper_VerifiableCredentials-CBT.pdf) to undertsand the business context for this work.

# Purpose

VCs exemplify a decentralsied model for high integrity digital data excahnge. There is no central data hub.  Instead there is a global ecosystem of thousands or millions of issuers, verifiers, and holders. A critical success factor is to reduce the cost of entry into the ecosystem so that it is cheap, fast, and simple for new issuers and verifiers to empower their communities with high integrity digital credentials. This project aims to provide free tools and guidance to facilitate uptake.

# Audience 

If you are an organisation that issues any kind of credential such as a permit, certificate, accreditation, license, or other "claim" of value to your community or constituency, then this project is for you. vckit provides the tools to equip your existing business systems with the ability to issue your existing credentials as high integrity, standards based, and interoperable VCs that your constituents (VC holders) can present to any party that needs to verify them.

VCs issued by vckit tooling can be verified using any mobile device camera to scan a QR code. This is important so that uptake can remain compatible with today's paper processes. There is no requirement for verifiers of credentials to adopt any new new technology in order to verify a credential. However, if you are an organisation that is likely to be verifying at scale or you wish to extract the digitial data in a credential for use in your business systems then vckit is also for you.  It provides an advanced multi-protocol verification capability that can be integrated with your systems.

# Get Started
 - This project provide all the utilities needed to create, verify and render veriable credentials

## Prerequisites

```bash
    veramo >= 5.2.0
    node >= 18.0
```

## How to start.

### To run a local server

```bash
    pnpm install # to install packages
    pnpm build # to build and extract api
    pnpm run vckit server # to start veramon server
```

### To run a local client

```bash
    navigate to package/app
    pnpm build # to build the client project
    pnpm run dev # to start client
```
