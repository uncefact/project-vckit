---
sidebar_label: 'Installation'
sidebar_position: 1
---

# Installation

## Prerequisites

- [Node.js](https://nodejs.org/en/) version 20.12.2
- [pnpm](https://pnpm.io/) version 8.14.1
- [yarn](https://yarnpkg.com/) version 1.22.22

:::warning
**Notice**: You should install the pnpm package manager globally on your machine by using the npm package manager. You can install pnpm by running the following command: `npm install -g pnpm@8.14.1`. Using [Corepack](https://nodejs.org/api/corepack.html) to install pnpm that will have some conflicts with the project dependencies that are using yarn package manager to install and build.
:::

This project has been tested and optimized for Node.js version v20.12.2 and pnpm version 8.14.1. Please note that using a Node.js version later than v20.12.2 may result incorrect functionality and potential bugs. It is strongly recommended to use these specific versions for running and testing the project. Deviating from these versions may result in unforeseen compatibility issues or unexpected behavior.

## Instal VCkit CLI

After cloned VCkit repository, go to `project-vckit/packages/cli` and run this command.

```bash
npm install -g .
```

This command will install VCkit CLI globally.

## Start using the CLI

Create a new folder, open a terminal, and run this command to check if the VCkit CLI has been installed successfully.

```bash
vckit -v
```

It's expected to show the version of VCkit CLI.

Next, run this command to create an **`agent.yml`** file.

```bash
vckit config create
```
