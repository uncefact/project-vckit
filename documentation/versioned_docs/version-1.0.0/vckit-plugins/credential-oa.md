import Disclaimer from './../\_disclaimer.mdx';

# Credential OpenAttestation Plugin

<Disclaimer />

- This plugin is used for issuing and verifying verifiable credential that adhere to OpenAttestation framework

## Usage

- Add the plugin to your `agent.yml` file

```yaml

///... other declarations
# Agent
agent:
  $require: '@veramo/core#Agent'
  $args:
    - schemaValidation: false
      plugins:
        /// ... other declarations
        - $require: '@uncefact/vckit-credential-oa#CredentialOA'
```

- And export the functions of the plugin to be used in the application

```yaml
- createVerifiableCredentialOA
- verifyCredentialOA
```

- Use the CLI to quickly issue a credential

```bash
pnpm vckit credentialOA create
```

> **Note**: The credential OA plugin only supports issuing by DID ethr. You can use the `@veramo/did-manager` plugin that should be configured in the `agent.yml` file to create a DID ethr.
