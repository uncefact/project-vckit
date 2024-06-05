---
sidebar_label: 'Installation'
sidebar_position: 1
---

# Installation
## Prerequisites
- [Node.js](https://nodejs.org/en/) version 20.12.2.
- [pnpm](https://pnpm.io/) version 8.14.1.

This project has been tested and optimized for Node.js version v20.12.2 and pnpm version 8.14.1. Please note that using a Node.js version later than v20.12.2 may result incorrect functionality and potential bugs. It is strongly recommended to use these specific versions for running and testing the project. Deviating from these versions may result in unforeseen compatibility issues or unexpected behavior.

## Clone vckit from github
Let's start by cloning the VCKit repository at the URL below.
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

**2. Generate secret key**

You need to generate an X25519 key, run this command in a terminal:
```bash
veramo config gen-key
```

## Start the local server
```bash
pnpm vckit server
```
Now you can check the api documentation at [http://localhost:3332/api-docs](http://localhost:3332/api-docs)
