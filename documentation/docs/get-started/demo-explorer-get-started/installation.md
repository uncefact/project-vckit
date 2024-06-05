---
sidebar_label: 'Installation'
sidebar_position: 1
---

# Installation

## Prerequisites

- Clone [VCKit](https://github.com/uncefact/project-vckit.git) repository
- [Node.js](https://nodejs.org/en/) version 20.12.2.
- [pnpm](https://pnpm.io/) version 8.14.1.
- Make sure you have the API server started on local. See how to do it [here](/docs/get-started/api-server-get-started/installation).

This project has been tested and optimized for Node.js version v20.12.2 and pnpm version 8.14.1. Please note that using a Node.js version later than v20.12.2 may result incorrect functionality and potential bugs. It is strongly recommended to use these specific versions for running and testing the project. Deviating from these versions may result in unforeseen compatibility issues or unexpected behavior.

## Install dependencies

Let's install the dependencies of this project by running this command.

```bash
cd project-vckit & pnpm install
```

## Create env file

Create a new .env file at `packages/demo-explorer/.env`, and copy the content of `packages/demo-explorer/.env.example` into it.

```bash
cp packages/demo-explorer/.env.example packages/demo-explorer/.env
```

## Env variables

`REACT_APP_ENCRYPTED_ENDPOINT` - The endpoint to encrypt the data <br/>
`REACT_APP_QRCODE_VERIFY_ENDPOINT` - The endpoint to verify the QR code <br/>
`REACT_APP_SCHEMA_URL` - The schema URL configuration in the agent file (agent.yml) <br/>
`REACT_APP_REMOTE_AGENT_API_KEY` - The API key for the agent (not required if the agent is not protected by an API key) <br/>
`REACT_APP_DEFAULT_AGENT_ID` - The agent ID for the agent <br/>

- To get `REACT_APP_REMOTE_AGENT_API_KEY` value, you can check in `agent.yml` file, the value of `apiKey` in the `apiKeyAuth` function.

`agent.yml`
```yml
...
- - /agent
      - $require: '@vckit/remote-server?t=function#apiKeyAuth'
        $args:
          - apiKey: kh14g04piduv
...
```

## Start the web server

To start the VCKit Demo Exlorer on you local, run this command

```bash
cd packages/demo-explorer && pnpm dev
```

Now you can see the VCKit Demo Explorer at [`http://localhost:3000`](http://localhost:3000)