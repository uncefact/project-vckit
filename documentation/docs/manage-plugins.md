---
sidebar_position: 6
---

# How to create and manage plugins

## Create a new plugin

### Step 1: Init a new package

First, you need to navigate to `project-vckit/packages` and init a new package. 
In this guide, we implement a new plugin for hashing a string.

### Step 2: Define the plugin interface

Navigate to `packages/core-types/src/types`, create a new file and name it `Itools` (this is just an example). This interface extends **IPluginMethodMap** interface, and has a method **computeHash** with a string parameter.
```ts
import { IPluginMethodMap } from './IAgent.js';

/**
 * @public
 */
export interface ITools extends IPluginMethodMap {
  computeHash(args: string): Promise<string>;
}
```

### Step 3: Implement the plugin

Creating a new plugin means implementing the **IAgentPlugin** interface.

Example code of the Hash Tool:

```ts
import { IAgentPlugin, ITools } from '@vckit/core-types';
import { sha256 } from 'multiformats/hashes/sha2';
import { base58btc } from 'multiformats/bases/base58';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

export class MultibaseEncodedSHA256 implements IAgentPlugin {
  readonly methods: ITools;
  readonly schema = schema.ITools;

  constructor() {
    this.methods = {
      computeHash: this.computeHash.bind(this),
    };
  }

  async computeHash(value: string): Promise<string> {
    if (!value || typeof value !== 'string') {
      throw new Error('Value is invalid');
    }

    const bytes = new TextEncoder().encode(value);
    const hash = await sha256.digest(bytes);
    const multibasedHash = base58btc.encode(hash.bytes);
    return multibasedHash;
  }
}
```

There're 2 properties of the class are required, both of them are from @vckit/core-types:
- `methods`
- `schema`

## Manage plugin within agent file

As you may know, working with VCKit is all about the agent. If you have your custom plugin and want to use it as an extended function then you need to add it to the agent. Here's how to do it.

### Step 1: Add the plugin to agent.yml
Open the `agent.yml` file, and add this line `- $require: '@vckit/tools#MultibaseEncodedSHA256'` at the end of the **agent**. The updated agent will look like this.

```yml
# Agent
agent:
  $require: '@veramo/core#Agent'
  $args:
    - schemaValidation: false
      plugins:
        - $ref: /keyManager
        - $ref: /didManager
        - $ref: /didResolver
        - $ref: /didDiscovery
        - $ref: /messageHandler
        - $require: '@veramo/did-comm#DIDComm'
        - $require: '@vckit/credential-router#CredentialRouter'
        - $require: '@veramo/credential-w3c#CredentialPlugin'
        - $require: '@vckit/credential-oa#CredentialOA'
        - $ref: /credentialIssuerLD
        - $require: '@veramo/credential-eip712#CredentialIssuerEIP712'
        - $require: '@veramo/selective-disclosure#SelectiveDisclosure'
        - $require: '@veramo/data-store#DataStore'
          $args:
            - $ref: /dbConnection
        - $require: '@veramo/data-store#DataStoreORM'
          $args:
            - $ref: /dbConnection
        - $ref: /renderer
        - $ref: /encryptedStorage
        - $ref: /revocationList
        - $require: '@veramo/credential-status#CredentialStatusPlugin'
          $args:
            - RevocationList2020Status:
                $require: '@vckit/revocationlist?t=object#checkStatus'
        - $require: '@vckit/tools#MultibaseEncodedSHA256'
```

### Step 2: Expose the method.

Under **constants** > **methods**, and the new method from the plugin. 
Example: we expose the computeHash method at the end of the **methods**.
```yml
- computeHash
```

Now you can build the project-vckit and start the vckit api server and test the new plugin. 