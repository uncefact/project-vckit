import Disclaimer from './../\_disclaimer.mdx';

# Credential Router

<Disclaimer />

This plugin is used to route for issuing and verifying verifiable credential that will navigate to the correct plugin based on the proof format of the credential.

## Usage

- Add this declaration to `agent.yml` config file

```yaml
# Agent
agent:
  $require: '@veramo/core#Agent'
  $args:
    - schemaValidation: false
      plugins:
        - $require: '@vckit/credential-router#CredentialRouter'
```

- And export the functions of the plugin to be used in the application

```yaml
- routeCreationVerifiableCredential
- routeVerificationCredential
```
