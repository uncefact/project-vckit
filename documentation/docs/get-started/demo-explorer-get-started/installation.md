---
sidebar_label: 'Installation'
sidebar_position: 1
---


# Installation
## Prerequisites
- Clone [VCKit](https://github.com/uncefact/project-vckit.git) repository
- [Node.js](https://nodejs.org/en/) version 18.17.0.
- [pnpm](https://pnpm.io/) version 8.14.1.
- Make sure you have the API server started on local. See how to do it [here](/docs/api-server-get-started/installation).

This project has been tested and optimized for Node.js version v18.17.0 and pnpm version 8.14.1. Please note that using a Node.js version later than v18.17.0 may result incorrect functionality and potential bugs. It is strongly recommended to use these specific versions for running and testing the project. Deviating from these versions may result in unforeseen compatibility issues or unexpected behavior.

## Create env file
Create a new .env file at `packages/demo-explorer/.env`, and copy the content of `packages/demo-explorer/.env.example` into it.
```bash
cp packages/demo-explorer/.env.example packages/demo-explorer/.env
```
## Start the web server
To start the VCKit Demo Exlorer on you local, run this command
```bash
cd packages/demo-explorer && pnpm dev
```
Now you can see the VCKit Demo Explorer at http://localhost:3000



