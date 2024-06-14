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
import { IAgent, IPluginMethodMap } from './IAgent.js';

/**
 * @public
 */
export interface IToolsComputeHashArgs {
  content: string;
}

/**
 * @public
 */
export interface ITools extends IPluginMethodMap {
  computeHash(
    args: IToolsComputeHashArgs,
    context: { agent?: IAgent },
  ): Promise<string>;
}

```

### Step 3: Implement the plugin

Creating a new plugin means implementing the **IAgentPlugin** interface.

Example code of the Hash Tool:

```ts
import { IAgentPlugin, ITools, IToolsComputeHashArgs } from '@vckit/core-types';
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

  async computeHash(args: IToolsComputeHashArgs): Promise<string> {
    if (
      typeof args !== 'object' ||
      !args?.content ||
      typeof args?.content !== 'string'
    ) {
      throw new Error('Value is invalid');
    }

    const bytes = new TextEncoder().encode(args.content);
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

As you may know, working with VCkit is all about the agent. If you have your custom plugin and want to use it as an extended function then you need to add it to the agent. Here's how to do it.

### Step 1: Add the plugin to agent.yml
Open the `agent.yml` file, and add this line `- $require: '@vckit/tools#MultibaseEncodedSHA256'` at the end of the **agent**. The updated agent will look like this.

```yml
# Agent
agent:
  $require: '@veramo/core#Agent'
  $args:
    plugins:
        ...
        # Add tools plugin for MultibaseEncodedSHA256
        - $require: '@vckit/tools?#MultibaseEncodedSHA256'
```

### Step 2: Expose the method.

Under **constants** > **methods**, and the new method from the plugin. 
Example: we expose the computeHash method at the end of the **methods**.
```yml
constants:
  methods:
    ...
    # Add method for MultibaseEncodedSHA256
    - computeHash

```

Now you can build the project-vckit and start the VCkit api server and test the new plugin. 