import Disclaimer from './../\_disclaimer.mdx';

# Config Agent File

<Disclaimer />

This guide explains the structure and options available within the agent config file. Use cases illustrating how to customise the config file for different scenarios are included.

## Diagram

The diagram belows describes the structure of an agent file

![agent file diagram](/img/agent-file.svg)

:::tip
For more information about yml configuration, you can see [here](https://veramo.io/docs/veramo_agent/configuration_internals)
:::

## Constants

This section is to declare all the constants of the agent.

```yml
constants:
  baseUrl: <BASE URL>
  port: <CUSTOM PORT>
  dbEncryptionKey: <SECRET KEY>
  databaseFile: <DATA BASE FILE>
  methods:
    - <PLUGIN FUNCTIONS>
```

- `baseUrl`: This specifies the base URL for the application or service.
- `port`: This specifies the port number on which the application will listen for incoming connections.
- `dbEncryptionKey`: This field contains a cryptographic key used for encrypting data in the database. It's a hexadecimal string representing the encryption key. Run this command `veramo config gen-key` to generate a key.
- `databaseFile`: This specifies the path to the SQLite database file.
- `methods`: This specifies the functions that are exposed by the plugins integrated within the agent

## **`$require` syntax**

Example:
`$require: '@veramo/data-store?t=object#migrations'`

- `@veramo/data-store` - Module name
- `t=object` - Optional. Type can be `function`, `object`, `class`. Default is `class`
- `#migrations` - Imported symbol name

## Database connection

This section is to declare all of the database connections that are used by the agent plugins. Below is a declaration of a database connection.

```yml
dbConnection: //this is name of the connection
  $require: typeorm#DataSource
  $args:
    - type: sqlite
      database:
        $ref: /constants/databaseFile
      synchronize: false
      migrationsRun: true
      migrations:
        $require: '@veramo/data-store?t=object#migrations'
      logging: false
      entities:
        $require: '@veramo/data-store?t=object#Entities'
```

- `dbConnection`: This is the name of the connection. It's a label that identifies this specific database connection configuration.
- `$require`: This indicates that a specific module or package is required to handle this configuration. In this case, it's indicating that the DataSource type from the typeorm package is required.
- `$args`: This specifies the arguments to be passed to the DataSource constructor.

  - `type`: Specifies the type of database to be used. You can use whatever type of database as long as it's supported by TypeOrm Datasource.
  - `database`: This field specifies the path to the SQLite database file.
    - `$ref`: This refers to a constant defined elsewhere in the configuration.
  - `synchronize`: Determines whether TypeORM should automatically synchronize the database schema.
  - `migrationsRun`: Specifies whether TypeORM should run migrations automatically. It's set to true, indicating that migrations should be executed.
  - `migrations`: Specifies the location of migration files.
    - `$require`: This indicates that migration files are required from a specific module. It's pointing to the migrations provided by the **@veramo/data-store package**.
  - `logging`: Specifies whether TypeORM should log SQL queries. It's set to false to disable logging.
  - `entities`: Specifies the entities (database tables) managed by TypeORM.

    - `$require`: This indicates that entities are required from a specific module. It's pointing to the entities provided by the **@veramo/data-store package**.

## Server configuration

This section is to config the server.

```yml
server:
  baseUrl:
    $ref: /constants/baseUrl
  port:
    $ref: /constants/port
  use:
    - - $require: '@vckit/remote-server?t=function#RequestWithAgentRouter'
        $args:
          - agent:
              $ref: /agent
```

1. `baseUrl` and `port`:
   - These fields define the base URL and port number where the server will be hosted. However, instead of directly providing values, they reference values from the constants section. This ensures that the server's base URL and port remain consistent and can be easily modified in one central place.
2. `use`:
   This section configures middleware for the server's request handling. **RequestWithAgentRouter**: This middleware is being utilized, which seems to be custom functionality provided by the @vckit/remote-server package. It appears to add information about an agent to incoming requests.

- `$require`: Specifies the module or package required to handle this middleware.
- `$args`: Specifies the arguments to be passed to the middleware. In this case, it's using agent.
  - `agent`: This argument is being provided to the middleware. It references a value from elsewhere in the configuration, specifically from `/agent`. This likely injects agent-related information or functionality into incoming requests, enhancing their handling within the server.

### Authentication middleware plugin

This section is to declare the middleware for the server. The authentication middleware plugin is used to check the incoming request for a valid token.

```yml
server:
  baseUrl:
    $ref: /constants/baseUrl
  port:
    $ref: /constants/port
  use:
    - - $require: '@vckit/remote-server?t=function#RequestWithAgentRouter'
        $args:
          - agent:
              $ref: /agent

     - - /agent
      # Authentication middleware
      - $require: '@vckit/remote-server?t=function#apiKeyAuth'
        $args:
          - apiKey: <your_api_key>
```

The authentication middleware plugin is added by attaching the `apiKeyAuth` function to the route of the server with the `apiKey` argument. The `apiKey` argument is important to authenticate the incoming request, it also be used on Explorer to authenticate the agent.

## Plugins configuration

Functionality in VCkit is added to the agent through a plugin system. Each plugin will have different arguments and required packages. However, this is basically how to declare a plugin.

**Example**

```yml
renderer:
  $require: '<required packages>'
  $args:
    - exampleArg: <field value>
```

- `renderer`: This is the plugin's name.
- `$require`: Specifies the module or package required to handle functionality.
- `$args`: Specifies the arguments to be passed to the module.

## Agent configuration

```yml
# Agent
agent:
  $require: '@veramo/core#Agent'
  $args:
    - schemaValidation: false
      plugins:
        - $ref: <path to the plugin defined in the agent file>
        - $require: '<required package>'
          $args:
            - $ref: <path to the constant>
```

- The configuration is under the `agent` key, indicating settings specific to the agent.
  - `$require`: Specifies the module or package required to instantiate the agent. In this case, it's @veramo/core#Agent, which is responsible for creating and managing the agent.
  - `$args`: Specifies the arguments to be passed to the agent constructor.
    - `schemaValidation`: A boolean flag indicating whether schema validation should be enabled. Here, it's set to `false`, meaning schema validation is disabled.
    - `plugins`: Specifies the plugins to be loaded by the agent.
      - `$ref`: This references a plugin configuration defined elsewhere in the agent file.
      - `$require`: Specifies the module or package required by the plugin
        - `$args`: (optional) Specifies arguments to be passed to the plugin constructor.
