# Revocation list 2020

The revocation list 2020 plugin is used to revoke and verify the verify credential based on the revocation list 2020 https://w3c-ccg.github.io/vc-status-rl-2020/

## Usage

### Configuration

To use the plugin you need to add the following configuration to the agent.yml

First, define the revocation list plugin:

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
```

Second, add the plugin and credential status plugin to the agent plugins list:

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

Then, set the revocation list middleware to inject the credential status to the credential when it is issued:

```yaml
- $require: '@vckit/revocationlist?t=function#revocationList2020'
  $args:
    - apiRoutes:
        - /createVerifiableCredential
      revocationListPath: http://localhost:3332
      bitStringLength: 8
      # The issuer DID here is temporary, it will be changed.
      revocationVCIssuer: did:web:vc.example.com
```

Every time the credential is issued by API `/createVerifiableCredential`, the middleware will inject the credential status to the credential.
