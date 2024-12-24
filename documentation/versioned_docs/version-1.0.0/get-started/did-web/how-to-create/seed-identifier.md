---
sidebar_label: 'Preconfigured Setup: Seed Identifier Script'
sidebar_position: 1
---

import Disclaimer from './../../../\_disclaimer.mdx';

# Preconfigured Setup: Seed Identifier Script

<Disclaimer />

## Overview

The easiest way to create a `did:web` in Project VCkit is by using the **Seed Identifier Script**. This method automatically sets up a `did:web` pointing to the preconfigured GitHub Pages URL for Project VCkit.

This setup is ideal for developers who need a quick and reliable `did:web` for testing or development without configuring custom hosting.

## How to Use

In this guide, we'll use CLI to seed the preconfigured identifier. Before proceeding, ensure that you have the CLI set up. **[Go here to set up the CLI](/docs/get-started/cli-get-started/installation)**

**Run the Seed Identifier Script**:  
 Navigate to your project directory and run the following command:

```bash
pnpm seed-identifier
```

:::note
The Docker Compose entrypoint includes a shell command to run the seed-identifier script automatically.
:::

**Resulting DID**

The script will generate a did:web that points to the following GitHub Pages URL:

`did:web:uncefact.github.io:project-vckit:test-and-development`

**What Happens**

- The script imports the predefined identifier located in the repo at `/development/did-web-identifier`.

- This identifier contains the public and private key pair, which is then imported into the local key management system (KMS).

- The did:web document itself has already been generated and hosted at `https://uncefact.github.io/project-vckit/test-and-development/did.json`.

## When to Use This Method

### For Development and Testing

If you're in the development phase and don't want the hassle of setting up your own domain or local server, this method gives you a preconfigured did:web that’s easy to use.

### Quick Start for New Users

New users can immediately start working with decentralised identity without any additional configuration.
