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

## Clone VCkit from github

Let's start by cloning the VCkit repository at the URL below.

```bash
https://github.com/uncefact/project-vckit.git
```

## Install dependencies

Let's install the dependencies of this project by running this command.

```bash
cd project-vckit & pnpm install
```

...then run this command to build the project

```bash
pnpm build
```

## Initialize the agent configuration

:::tip
To understand more about the agent file structure and how to config it, read [here](/docs/agent-configuration/config-agent-file).
:::
The `pnpm vckit config` command will create a `agent.yml` file in the root of the project. This file contains the configuration for the Veramo agent. You can edit this file to configure the agent to your needs. The default configuration is sufficient to get started.

```bash
pnpm vckit config
```

After run this command, you will have an `agent.yml` file in your root directory.

## Optional: Configure the agent

You can configure the agent by editing the `agent.yml` file in the root of the project. You can change the `infuraProjectId` and `dbEncryptionKey` to your own values.

Currently, the `infuraProjectId` and `dbEncryptionKey` are set to the default values. That mean you can use the default values to run the project. However, it is recommended to change the default values to your own values.

**1. Infura Project ID**

To create your own Infura Project ID, visit https://www.infura.io and follow the instruction.

**2. Database Encryption Key**

The Database Encryption Key is used to encrypt private key material while at rest or in memory. This ensures that sensitive data is protected even if the storage medium is compromised.

### Key Type

This key type is an X25519 key.

### Usage

- If you want to generate a new key, you can use the following command:

  ```bash
  pnpm vckit config gen-key
  ```

  The result for example:

  > X25519 raw private key (hex encoded):
  > 4ae7b7d37d82998a759c5d6241e602de5784a05c11be3812c3d31cb854e9be21
  > You can use this key with @veramo/kms-local#SecretBox or replace the default agent.yml 'dbEncryptionKey' constant

- Update the `dbEncryptionKey` in the `agent.yml` file with the generated key.

  ```yaml
  dbEncryptionKey: 4ae7b7d37d82998a759c5d6241e602de5784a05c11be3812c3d31cb854e9be21
  ```

> **_WARNING_**:
>
> - The `dbEncryptionKey` is a sensitive value. Do not share it with anyone. If you lose the key, you will not be able to decrypt the data stored in the database.
> - In a production environment, please do not use the default key in a production environment.

## Start the local server

```bash
pnpm vckit server
```

Now you can check the api documentation at [http://localhost:3332/api-docs](http://localhost:3332/api-docs)
