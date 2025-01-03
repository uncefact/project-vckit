# project-vckit

A reference implementation of a verifiable credentials platform for digital trade and traceability. Please review this [verifiable credentials white paper](https://unece.org/sites/default/files/2022-07/WhitePaper_VerifiableCredentials-CBT.pdf) to understand the business context for this work.

# Purpose

VCs exemplify a decentralized model for high integrity digital data exchange. There is no central data hub. Instead there is a global ecosystem of thousands or millions of issuers, verifiers, and holders. A critical success factor is to reduce the cost of entry into the ecosystem so that it is cheap, fast, and simple for new issuers and verifiers to empower their communities with high integrity digital credentials. This project aims to provide free tools and guidance to facilitate uptake.

# Audience

If you are an organisation that issues any kind of credential such as a permit, certificate, accreditation, license, or other "claim" of value to your community or constituency, then this project is for you. VCkit provides the tools to equip your existing business systems with the ability to issue your existing credentials as high integrity, standards based, and interoperable VCs that your constituents (VC holders) can present to any party that needs to verify them.

VCs issued by VCkit tooling can be verified using any mobile device camera to scan a QR code. This is important so that uptake can remain compatible with today's paper processes. There is no requirement for verifiers of credentials to adopt any new new technology in order to verify a credential. However, if you are an organisation that is likely to be verifying at scale or you wish to extract the digital data in a credential for use in your business systems then VCkit is also for you. It provides an advanced multi-protocol verification capability that can be integrated with your systems.

# Get Started

The vckit is built on top of the [Veramo](https://veramo.io/) agent framework. Veramo is a modular agent framework for creating self-sovereign identity (SSI) enabled applications. It is a great place to start if you are new to SSI. The vckit is a set of Veramo plugins that are configured to work together to provide a complete VC issuance and verification capability.

## Prerequisites

- [Node.js](https://nodejs.org/en/) version 20.12.2
- [pnpm](https://pnpm.io/) version 8.14.1
- [yarn](https://yarnpkg.com/) version 1.22.22

> :warning: **Notice**: You should install the pnpm package manager globally on your machine by using the npm package manager. You can install pnpm by running the following command: `npm install -g pnpm@8.14.1`. Using [Corepack](https://nodejs.org/api/corepack.html) to install pnpm that will have some conflicts with the project dependencies that are using yarn package manager to install and build.

This project has been tested and optimized for Node.js version v20.12.2 and pnpm version 8.14.1. Please note that using a Node.js version later than v20.12.2 may result incorrect functionality and potential bugs. It is strongly recommended to use these specific versions for running and testing the project. Deviating from these versions may result in unforeseen compatibility issues or unexpected behavior.

## Installation and Setup

```bash
# Install dependencies
pnpm install

# Copy the .env.example file to .env for the demo explorer
cp packages/demo-explorer/.env.example packages/demo-explorer/.env

# Build
pnpm build

# Initialize the agent configuration
pnpm vckit config
```

The `pnpm vckit config` command will create a `agent.yml` file in the root of the project. This file contains the configuration for the Veramo agent. You can edit this file to configure the agent to your needs. The default configuration is sufficient to get started.

## Seed Identifier

This feature automates the process of seeding a predefined DID document for use in development environments.

The DID document is located at `documentation/static/test-and-development/did.json`.
This document is built and served using Docusaurus.

A seed-identifier script is available to seed the identifier into the vckit instance.
This script runs the `vckit did import` command and uses a predefined identifier file located at `/development/did-web-identifier.json`.

The predefined did:web used for seeding is: `did:web:uncefact.github.io:project-vckit:test-and-development`

```bash
# Seed identifier
pnpm seed-identifier
```

The Docker Compose entrypoint includes a shell command to run the seed-identifier script automatically.

## Start the server on local

```bash
# Start the api server
pnpm vckit server

# Start the web server
cd packages/demo-explorer && pnpm dev
```

Now you can open the demo explorer at http://localhost:3000. And you can check the api documentation at http://localhost:3332/api-docs.

## Start the documentation page

```bash
# Navigate to the documentation folder
cd documentation

# Install dependencies
npm install

# Start the documentation server
npm start
```

Now you can open the documentation at http://localhost:3030.

## The containerized VCkit API

This Dockerfile is optimized for deploying the VCkit API in production environments. It leverages Docker multi-stage builds to separate the build environment from the runtime environment, resulting in a smaller final image size and enhanced security.

### Building the Docker image

Run the following command in the directory containing the Dockerfile:

```bash
docker build -t vckit-api .
```

### Building the Docker Image with Custom Configuration

You can customize the Docker image build process by specifying a custom configuration file path for the VCkit API.
Ensure that you have the custom configuration file (`<config_path>`) ready. This file should contain the necessary settings and configurations for the VCkit API.
Use the `--build-arg` flag to specify the `DATABASE_TYPE`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_ENCRYPTION_KEY`, `PORT`, `PROTOCOL`, `API_DOMAIN`, and `API_KEY` build arguments when running the docker build command.

```bash
docker build \
  --build-arg DATABASE_TYPE=postgres \
  --build-arg DATABASE_USERNAME=postgres \
  --build-arg DATABASE_PASSWORD=postgres \
  --build-arg DATABASE_NAME=vckit \
  --build-arg DATABASE_HOST=localhost \
  --build-arg DATABASE_PORT=5432 \
  --build-arg DATABASE_ENCRYPTION_KEY=29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c \
  --build-arg PORT=3332 \
  --build-arg PROTOCOL=http \
  --build-arg API_DOMAIN=localhost:3332 \
  --build-arg API_KEY=test123 \
  -t vckit-api .
```

Replace the values of the build arguments with your desired configurations.

### Running the Docker container

Execute the following command:

```bash
docker run -p 3332:3332 vckit-api
```

This will expose the VCkit API on port 3332 of your Docker host.

### Running the Docker container with Docker Compose

You can use Docker Compose to manage your VCkit API along with a PostgreSQL database. Docker Compose simplifies the process of orchestrating multiple containers and their dependencies.

Run the following command to start the containers:

```bash
docker-compose up
```

This command will build the Docker images (if not already built) and start the containers defined in the `docker-compose.yaml` file. The VCkit API will be accessible at `http://localhost:3332`.

## Documentation Versioning

The project uses Docusaurus for documentation management. Documentation versions are managed through a release script and automated pipeline.

### Release Script

The `scripts/release-doc.js` script automates the process of creating new documentation versions:

- Reads the documentation version from `version.json`
- Creates Docusaurus version using `docVersion` value from `version.json` file
  To manually create a new documentation version:

```bash
# Run the release script
pnpm release:doc
```

### Release Guide

To release a new version, ensure we have the `version.json` file updated with the new version number. Then, create a new release tag with the following steps:

1. Create a new release branch from `next` with the version number as the branch name.
2. Update the `version.json` file with the new version number.
3. Generate new documentation version using the release script `pnpm release:doc`.
4. Check API documentation and update if necessary.
5. Commit the changes and push the branch.
6. Create a pull request from the release branch to `main`.
7. Merge the pull request.
8. Create a new release tag with the version number.
8. Push the tag to the repository.

(\*) With the `version.json` file, it contains the version number in the following format:

```json
{
  "version": "MAJOR.MINOR.PATCH",
  "apiVersion": "MAJOR.MINOR.PATCH",
  "docVersion": "MAJOR.MINOR.PATCH",
  "dependencies": {}
}
```

We need to change manually the `version`, `apiVersion`, and `docVersion` fields.
