---
sidebar_label: 'Installation'
sidebar_position: 1
---


# Installation
## Prerequisites
* You need to have Node v14 or later installed.
* This guide uses npm as the package manager but you can use yarn or anything else.
* You will need to get a project ID from infura https://www.infura.io

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
```bash
npm install typescript ts-node --dev
```
## Generate a secret key and save it in a safe place for later use
```bash
npx @veramo/cli config create-secret-key
```
## Install VCKit plugins
```bash
npm install @vckit/core-types
```
## Install Veramo packages
The vckit is built on top of the [Veramo](https://veramo.io/) agent framework. Veramo is a modular agent framework for creating self-sovereign identity (SSI) enabled applications. It is a great place to start if you are new to SSI. The vckit is a set of Veramo plugins that are configured to work together to provide a complete VC issuance and verification capability.
```bash
npm install @veramo/core @veramo/credential-w3c @veramo/credential-ld @veramo/did-resolver @veramo/did-manager @veramo/key-manager @veramo/did-provider-key @veramo/did-provider-pkh @veramo/did-provider-jwk @veramo/did-provider-ethr @veramo/did-provider-web @veramo/kms-local did-resolver @veramo/kms-web3 @veramo/data-store
```

## Install DID resolvers
```bash
npm install did-resolver ethr-did-resolver web-did-resolver
```
## Install Sqlite and Typeorm
```bash
npm install sqlite3 typeorm  
```
## Create tsconfig.json
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



