# Encrypted Storage

The encrypted storage plugin provides a secure storage for the agent. It is used to store the verifiable credentials that issued when call the `routeCreationVerifiableCredential` method.

## Usage

### Configuration

To use the encrypted storage plugin, you need to add the following configuration to the agent.yml.

- First, add the `dbConnectionEncrypted` to define the database connection for the encrypted storage.

```yaml
dbConnectionEncrypted:
  $require: typeorm#DataSource
  $args:
    - type: sqlite
      database:
        $ref: /constants/databaseFile
      synchronize: false
      migrationsRun: true
      migrations:
        $require: '@uncefact/vckit-encrypted-storage?t=object#migrations'
      logging: false
      entities:
        $require: '@uncefact/vckit-encrypted-storage?t=object#Entities'
```

Second, add the `encryptedStorage` to define the encrypted storage plugin.

```yaml
# Encrypted Storage Plugin
encryptedStorage:
  $require: '@uncefact/vckit-encrypted-storage#EncryptedStorage'
  $args:
    - dbConnection:
        $ref: /dbConnectionEncrypted
```

then require the encrypted storage plugin to the agent.

```yaml
# Agent
agent:
  $require: '@veramo/core#Agent'
  $args:
    - schemaValidation: false
      plugins:
        # Plugins
        - $ref: /encryptedStorage
```

Then, you need to expose the functions of the plugin.

```yaml
- encryptAndStoreData
- fetchEncryptedData
- fetchEncryptedDataByCredentialHash
```

After that, you need to configure the middleware to use the encrypted storage plugin to store the verifiable credentials when issue the verifiable credentials. You can configure the middleware in the `apiRoutes` section of the agent.yml.

```yaml
# API base path
- - /agent
  - $require: '@uncefact/vckit-remote-server?t=function#apiKeyAuth'
    $args:
      - apiKey: test123
  # Configure the middleware before the AgentRouter function. The middleware only allow the apis in `apiRoutes` to use the encrypted storage plugin.
  - $require: '@uncefact/vckit-encrypted-storage?t=function#encryptedStoreMiddleware'
    $args:
      - apiRoutes:
          - /routeCreationVerifiableCredential

  - $require: '@uncefact/vckit-remote-server?t=function#AgentRouter'
    $args:
      - exposedMethods:
          $ref: /constants/methods
```

Finally, you need to expose the endpoint that can be used to fetch the encrypted verifiable credential. You can configure the endpoint in the `apiRoutes` section of the agent.yml.

```yaml
# Encrypted storage API
- - /encrypted-storage
  - $require: '@uncefact/vckit-encrypted-storage?t=function#encryptedStoreRouter'
```

### To use the encrypted storage plugin

- To use the encrypted storage plugin, you need to call the `routeCreationVerifiableCredential` method with the parameter `save` to store the verifiable credential, then it will trigger the middleware to store the verifiable credential to the encrypted storage.

- After that, it will response the decrypted key, id of encrypted verifiable credential, and the verifiable credential.

- Use the decrypted key to decrypt the encrypted verifiable credential that fetched from the endpoint `/encrypted-storage/encrypted-data/:id`.
