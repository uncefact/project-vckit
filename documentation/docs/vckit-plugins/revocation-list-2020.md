# Revocation list 2020

The revocation list 2020 plugin is used to revoke and verify the verify credential based on the revocation list 2020 https://w3c-ccg.github.io/vc-status-rl-2020/

## Usage

### Configuration

To use the plugin you need to add the following configuration to the agent.yml

- First, define the revocation list plugin:

```yaml
dbConnectionRevocationList:
  $require: typeorm#DataSource
  $args:
    - type: sqlite
      database:
        $ref: /constants/databaseFile
      synchronize: true
      migrationsRun: true
      migrations:
        $require: '@vckit/revocationlist?t=object#migrations'
      logging: false
      entities:
        $require: '@vckit/revocationlist?t=object#Entities'

revocationList:
  $require: '@vckit/revocationlist#RevocationStatus2020'
  $args:
    - dbConnection:
        $ref: /dbConnectionRevocationList
      revocationListPath: http://localhost:3332
      bitStringLength: 8
```

- Second, add the plugin and credential status plugin to the agent plugins list:

```yaml
agent:
  $require: '@vckit/core#Agent'
  $args:
    - schemaValidation: false
      plugins:
        # Plugins
        - $ref: /revocationList
        - $require: '@veramo/credential-status#CredentialStatusPlugin'
          $args:
            - RevocationList2020Status:
                $require: '@vckit/revocationlist?t=object#checkStatus'
```

- Then, set the revocation list middleware to inject the credential status to the credential when it is issued:

```yaml
- $require: '@vckit/revocationlist?t=function#revocationList2020'
  $args:
    - apiRoutes:
        - /routeCreationVerifiableCredential
      supportedProofFormats:
        - jwt
        - lds
```

- After that, you need to expose the plugin functions:

```yaml
- revokeCredential
- activateCredential
- checkStatus
```

Every time the credential is issued by API `/routeCreationVerifiableCredential`, the middleware will inject the credential status to the credential.

## Sample Operations
Please make sure you have the VCkit API server started on your local machine, and that you're running the Demo Explorer locally as well.
* [Getting started with Demo Explorer](/docs/category/demo-explorer).

After that you can follow this intruction to try some sample operations like revoking/unrevoking VC with VCkit Revocation List 2020 plugin
* [VCkit Revocation List 2020 sample operations](/docs/get-started/demo-explorer-get-started/basic-operations).
