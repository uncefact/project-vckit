# project-vckit

A reference implementation of a verifiable credentials platform for digital trade and traceability. Please review this [verifiable credentials white paper](https://unece.org/sites/default/files/2022-07/WhitePaper_VerifiableCredentials-CBT.pdf) to undertsand the business context for this work.

# Purpose

VCs exemplify a decentralsied model for high integrity digital data excahnge. There is no central data hub. Instead there is a global ecosystem of thousands or millions of issuers, verifiers, and holders. A critical success factor is to reduce the cost of entry into the ecosystem so that it is cheap, fast, and simple for new issuers and verifiers to empower their communities with high integrity digital credentials. This project aims to provide free tools and guidance to facilitate uptake.

# Audience

If you are an organisation that issues any kind of credential such as a permit, certificate, accreditation, license, or other "claim" of value to your community or constituency, then this project is for you. vckit provides the tools to equip your existing business systems with the ability to issue your existing credentials as high integrity, standards based, and interoperable VCs that your constituents (VC holders) can present to any party that needs to verify them.

VCs issued by vckit tooling can be verified using any mobile device camera to scan a QR code. This is important so that uptake can remain compatible with today's paper processes. There is no requirement for verifiers of credentials to adopt any new new technology in order to verify a credential. However, if you are an organisation that is likely to be verifying at scale or you wish to extract the digitial data in a credential for use in your business systems then vckit is also for you. It provides an advanced multi-protocol verification capability that can be integrated with your systems.

# Get Started

The vckit is built on top of the [Veramo](https://veramo.io/) agent framework. Veramo is a modular agent framework for creating self-sovereign identity (SSI) enabled applications. It is a great place to start if you are new to SSI. The vckit is a set of Veramo plugins that are configured to work together to provide a complete VC issuance and verification capability.

## Prerequisites

- [Node.js](https://nodejs.org/en/) version 16.x
- [pnpm](https://pnpm.io/) version 8.x

## Installation and Setup

```bash
# Install dependencies
pnpm install

# Initialize the agent configuration
pnpm vckit config

# Copy the .env.example file to .env for the demo explorer
cp packages/demo-explorer/.env.example packages/demo-explorer/.env

# Build
pnpm build
```

The `pnpm vckit config` command will create a `agent.yml` file in the root of the project. This file contains the configuration for the Veramo agent. You can edit this file to configure the agent to your needs. The default configuration is sufficient to get started.

## Start the server on local

```bash
# Start the api server
pnpm vckit server

# Start the web server
cd packages/demo-explorer && pnpm dev
```

Now you can open the demo explorer at http://localhost:3000. And you can check the api documentation at http://localhost:3332/api-docs.
