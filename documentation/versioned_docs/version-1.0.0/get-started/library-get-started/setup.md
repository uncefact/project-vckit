---
sidebar_label: 'Set Up'
sidebar_position: 2
---

import Disclaimer from './../../\_disclaimer.mdx';

# Set up Agent

<Disclaimer />

To start using VCkit, we need to initialize an agent.
## Copy database file
This tutorial will use the **did:web** method and we will need an available did:web identifier. To do that, we need to use the same database as the **VCkit API server** responsible for hosting the **did:web**.

Please follow these steps below:
1. Copy the **`database.sqlite`** from **PROJECT_VCKIT** folder at `/project_vckit/project-vckit/database.sqlite` to your root folder of this tutorial, in this case it's `/vckit/database.sqlite`.
2. Copy the value of `dbEncryptionKey` in `/project_vckit/project-vckit/agent.yml` file and paste it as the value of **DB_SECRET_KEY** variable will be mentioned in the next step.

:::note
Create a set up file in **`src/vckit/setup.ts`**, and add the following code.
:::
## Dependencies
Copy and paste this into your set up file.
```typescript
//VCkit interfaces and plugins
import {
    ICredentialPlugin,
    IDataStore,
    IDataStoreORM,
    IDIDManager,
    IKeyManager,
    IMessageHandler,
    IResolver,
    TAgent,
    IRenderer
} from '@vckit/core-types';

import { Renderer, WebRenderingTemplate2022 } from '@vckit/renderer';

//Veramo core and plugins
import { createAgent } from '@veramo/core';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
   CredentialIssuerLD,
    LdDefaultContexts,
    VeramoEcdsaSecp256k1RecoverySignature2020,
    VeramoEd25519Signature2018,
    VeramoJsonWebSignature2020,
} from '@veramo/credential-ld';

import { DIDResolverPlugin } from '@veramo/did-resolver';
import { KeyManager } from '@veramo/key-manager';
import { DIDManager } from '@veramo/did-manager';
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key';
import { getDidPkhResolver, PkhDIDProvider } from '@veramo/did-provider-pkh';
import { getDidJwkResolver, JwkDIDProvider } from '@veramo/did-provider-jwk';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { WebDIDProvider } from '@veramo/did-provider-web';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { Web3KeyManagementSystem } from '@veramo/kms-web3';

//custom resolvers
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { getResolver as webDidResolver } from 'web-did-resolver';

//veramo data store
import { Entities, KeyStore, DIDStore, PrivateKeyStore, migrations } from '@veramo/data-store'

//typeorm
import { DataSource } from 'typeorm'
```
## Variables
Create some variables in your set up file, remember to replace their value by yours.
```typescript
const DB_SECRET_KEY ='<The key you copied previously>';

const DATABASE_FILE = 'database.sqlite'
```
## Initialize the agent
This is how an agent is initialized in your set up file, copy and paste into your file.
```typescript
type InstalledPlugins = IResolver &
    IKeyManager &
    IDIDManager &
    ICredentialPlugin &
    IDataStoreORM &
    IDataStore &
    IMessageHandler&
    IRenderer;

const dbConnection = new DataSource({
    type: 'sqlite',
    database: DATABASE_FILE,
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
}).initialize()

export const agent: TAgent<InstalledPlugins> = createAgent<InstalledPlugins>({
    plugins: [
        new DIDResolverPlugin({
            resolver: new Resolver({
                ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
                ...webDidResolver(),
                ...getDidKeyResolver(),
                ...getDidPkhResolver(),
                ...getDidJwkResolver(),
            }),
        }),
        new KeyManager({
            store: new KeyStore(dbConnection),
            kms: {
                local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(DB_SECRET_KEY))),
                web3: new Web3KeyManagementSystem({}),
            },
        }),
        new DIDManager({
            store: new DIDStore(dbConnection),
            defaultProvider: 'did:web',
            providers: {
                'did:web': new WebDIDProvider({
                    defaultKms: 'local',
                }),
                'did:key': new KeyDIDProvider({
                    defaultKms: 'local',
                }),
                'did:pkh': new PkhDIDProvider({
                    defaultKms: 'local',
                }),
                'did:jwk': new JwkDIDProvider({
                    defaultKms: 'local',
                }),
            },
        }),
        new CredentialPlugin(),
        new CredentialIssuerLD({
            contextMaps: [LdDefaultContexts],
            suites: [
                new VeramoEcdsaSecp256k1RecoverySignature2020(),
                new VeramoJsonWebSignature2020(),
                new VeramoEd25519Signature2018(),
            ],
        }),
        new Renderer({
            providers: {
                WebRenderingTemplate2022: new WebRenderingTemplate2022(),
                SvgRenderingHint2022: new WebRenderingTemplate2022(),
            },
            defaultProvider: 'WebRenderingTemplate2022',
        })
    ],
});
```
