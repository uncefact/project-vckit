---
sidebar_label: 'Installation'
sidebar_position: 1
---

import Disclaimer from './../../\_disclaimer.mdx';

# Installation

<Disclaimer />

## Prerequisites

- [Node.js](https://nodejs.org/en/) version 20.12.2
- [pnpm](https://pnpm.io/) version 8.14.1
- [yarn](https://yarnpkg.com/) version 1.22.22

:::warning
**Notice**: You should install the pnpm package manager globally on your machine by using the npm package manager. You can install pnpm by running the following command: `npm install -g pnpm@8.14.1`. Using [Corepack](https://nodejs.org/api/corepack.html) to install pnpm that will have some conflicts with the project dependencies that are using yarn package manager to install and build.
:::

This project has been tested and optimized for Node.js version v20.12.2 and pnpm version 8.14.1. Please note that using a Node.js version later than v20.12.2 may result incorrect functionality and potential bugs. It is strongly recommended to use these specific versions for running and testing the project. Deviating from these versions may result in unforeseen compatibility issues or unexpected behavior.

## Create a new project

Let's start by creating a new project

```bash
mkdir vckit && cd vckit
npm init -y
```

Update to use ESM.

In **`package.json`**, add this:

```bash
"type": "module"
```

## Install dev dependencies

Run this command to install all the dependencies that needed.

```bash
npm install typescript ts-node --dev
```

## Generate a secret key

Run this command to gennerate a secret key and save it in a safe place for later use

```bash
npx @veramo/cli config create-secret-key
```

## Install VCkit plugins

```bash
npm install @vckit/core-types @vckit/renderer
```

## Install Veramo packages

The VCkit is built on top of the [Veramo](https://veramo.io/) agent framework. The VCkit is a set of Veramo plugins that are configured to work together to provide a complete VC issuance and verification capability. That's why we need to install all the veramo core plugins first. To do it, run this command.

```bash
npm install @veramo/core @veramo/credential-w3c @veramo/credential-ld @veramo/did-resolver @veramo/did-manager @veramo/key-manager @veramo/did-provider-key @veramo/did-provider-pkh @veramo/did-provider-jwk @veramo/did-provider-ethr @veramo/did-provider-web @veramo/kms-local did-resolver @veramo/kms-web3 @veramo/data-store
```

## Install other packages

Install some custom resolver by running this command.

```bash
npm install did-resolver ethr-did-resolver web-did-resolver
```

We also need to install sqlite3 with typeorm to store some data.

```bash
npm install sqlite3 typeorm
```

## Create tsconfig.json

Update your `tsconfig.json` file to make it like this

```json
{
  "compilerOptions": {
    "preserveConstEnums": true,
    "strict": true,
    "target": "esnext",
    "module": "esnext",
    "rootDir": "./",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "downlevelIteration": true
  }
}
```
