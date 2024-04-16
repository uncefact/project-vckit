---
sidebar_label: 'Installation'
sidebar_position: 1
---


# Installation
## Prerequisites
- [Node.js](https://nodejs.org/en/) version 18.17.0.
- [pnpm](https://pnpm.io/) version 8.14.1.

This project has been tested and optimized for Node.js version v18.17.0 and pnpm version 8.14.1. Please note that using a Node.js version later than v18.17.0 may result incorrect functionality and potential bugs. It is strongly recommended to use these specific versions for running and testing the project. Deviating from these versions may result in unforeseen compatibility issues or unexpected behavior.

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
## Initialize the agent configuration
```bash
pnpm vckit config
```
The `pnpm vckit config` command will create a `agent.yml` file in the root of the project. This file contains the configuration for the Veramo agent. You can edit this file to configure the agent to your needs. The default configuration is sufficient to get started.

## Start the local server
```bash
pnpm vckit server
```
Now you can check the api documentation at http://localhost:3332/api-docs



