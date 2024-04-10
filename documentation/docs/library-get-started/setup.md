---
sidebar_label: 'Set Up'
sidebar_position: 2
---

# Set up
To start using VCKit, we need to initialize an agent.
Create a set up file in **`src/vckit/setup.ts`**, and add the following code.
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
const INFURA_PROJECT_ID = '<YOUR-INFURA-PROJECT-ID>';
const DB_SECRET_KEY ='<YOUR-GENERATED-SECRET-KEY>';

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
            defaultProvider: 'did:ethr:goerli',
            providers: {
                'did:ethr': new EthrDIDProvider({
                    defaultKms: 'local',
                    ttl: 60 * 60 * 24 * 30 * 12 + 1,
                    networks: [
                        {
                            name: 'mainnet',
                            rpcUrl: 'https://mainnet.infura.io/v3/' + INFURA_PROJECT_ID,
                        },
                        {
                            name: 'goerli',
                            rpcUrl: 'https://goerli.infura.io/v3/' + INFURA_PROJECT_ID,
                        },
                        {
                            chainId: 421613,
                            name: 'arbitrum:goerli',
                            rpcUrl:
                                'https://arbitrum-goerli.infura.io/v3/' + INFURA_PROJECT_ID,
                            registry: '0x8FFfcD6a85D29E9C33517aaf60b16FE4548f517E',
                        },
                    ],
                }),
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
