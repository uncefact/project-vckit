---
sidebar_label: 'Installation'
sidebar_position: 1
---
:::info
You can find the complete source code of this tutorial [here](#)
:::
<!-- todo: update the github link of the example code -->
# Installation
## Prerequisites
* You need to have Node v14 or later installed.
* This guide uses npm as the package manager but you can use yarn or anything else.
* You will need to get a project ID from infura https://www.infura.io
* Make sure you have the [VCKit API server](/docs/category/api-server) started.

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
## Install VCKit plugins
```bash
npm install @vckit/core-types @vckit/renderer
```
## Install Veramo packages
The vckit is built on top of the [Veramo](https://veramo.io/) agent framework. The vckit is a set of Veramo plugins that are configured to work together to provide a complete VC issuance and verification capability. That's why we need to install all the veramo core plugins first. To do it, run this command.
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



