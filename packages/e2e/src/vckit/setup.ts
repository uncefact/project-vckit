import {
  IAgent,
  ICredentialIssuer,
  ICredentialPlugin,
  ICredentialVerifier,
  IDataStore,
  IDataStoreORM,
  IDIDManager,
  IKeyManager,
  IMessageHandler,
  IResolver,
  TAgent,
} from '@uncefact/vckit-core-types';

import { createAgent, IAgentOptions } from '@veramo/core';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
  CredentialIssuerLD,
  ICredentialIssuerLD,
  LdDefaultContexts,
  VeramoEcdsaSecp256k1RecoverySignature2020,
  VeramoEd25519Signature2018,
} from '@veramo/credential-ld';

import {
  CredentialMerkleDisclosureProof,
  VCKitMerkleDisclosureProof2021,
} from '@uncefact/vckit-credential-merkle-disclosure-proof';

import { DIDResolverPlugin } from '@veramo/did-resolver';
import { KeyManager } from '@veramo/key-manager';
import { DIDManager } from '@veramo/did-manager';
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key';
import { getDidPkhResolver, PkhDIDProvider } from '@veramo/did-provider-pkh';
import { getDidJwkResolver, JwkDIDProvider } from '@veramo/did-provider-jwk';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { WebDIDProvider } from '@veramo/did-provider-web';
import {
  DataStoreJson,
  DIDStoreJson,
  KeyStoreJson,
  PrivateKeyStoreJson,
} from '@veramo/data-store-json';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { Web3KeyManagementSystem } from '@veramo/kms-web3';
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { getResolver as webDidResolver } from 'web-did-resolver';

import express from 'express';
import { Server } from 'http';

import { Entities, migrations } from '@veramo/data-store';
import { AgentRestClient } from '@veramo/remote-client';
import {
  AgentRouter,
  RequestWithAgentRouter,
} from '../../../remote-server/src/index.js';
import { DataSource } from 'typeorm';
import * as fs from 'fs';

const INFURA_PROJECT_ID = '33aab9e0334c44b0a2e0c57c15302608';
const DB_SECRET_KEY =
  '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa83';

const memoryJsonStore = {
  notifyUpdate: () => Promise.resolve(),
};

type InstalledPlugins = IResolver &
  IKeyManager &
  IDIDManager &
  ICredentialPlugin &
  IDataStoreORM &
  IDataStore &
  IMessageHandler;

export function getAgent(options?: IAgentOptions): TAgent<InstalledPlugins> {
  const agent: TAgent<InstalledPlugins> = createAgent<InstalledPlugins>({
    ...options,
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
        store: new KeyStoreJson(memoryJsonStore),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStoreJson(
              memoryJsonStore,
              new SecretBox(DB_SECRET_KEY)
            )
          ),
          web3: new Web3KeyManagementSystem({}),
        },
      }),
      new DIDManager({
        store: new DIDStoreJson(memoryJsonStore),
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
      new DataStoreJson(memoryJsonStore),
      new CredentialPlugin(),
      new CredentialIssuerLD({
        contextMaps: [LdDefaultContexts],
        suites: [
          new VeramoEcdsaSecp256k1RecoverySignature2020(),
          new VeramoEd25519Signature2018(),
        ],
      }),
      new CredentialMerkleDisclosureProof({
        contextMaps: [LdDefaultContexts],
        suites: [],
      }),
      ...(options?.plugins || []),
    ],
  });
  return agent;
}

const databaseFile = `./tmp/rest-database-${Math.random().toPrecision(
  5
)}.sqlite`;
const port = 3002;
const basePath = '/agent';
let dbConnection: Promise<DataSource>;
let serverAgent: IAgent;
let restServer: Server;

export const getRestAgent = (options?: IAgentOptions) =>
  createAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IDataStoreORM &
      IResolver &
      ICredentialIssuer &
      ICredentialVerifier
  >({
    ...options,
    plugins: [
      new AgentRestClient({
        url: 'http://localhost:' + port + basePath,
        enabledMethods: serverAgent.availableMethods(),
        schema: serverAgent.getSchema(),
      }),
    ],
  });

export const setup = async (options?: IAgentOptions): Promise<boolean> => {
  dbConnection = new DataSource({
    name: options?.context?.['dbName'] || 'sqlite-test',
    type: 'sqlite',
    database: databaseFile,
    synchronize: false,
    migrations: migrations,
    migrationsRun: true,
    logging: false,
    entities: Entities,
  }).initialize();

  serverAgent = getAgent(options);
  const agentRouter = AgentRouter({
    exposedMethods: serverAgent.availableMethods(),
  });

  const requestWithAgent = RequestWithAgentRouter({
    agent: serverAgent,
  });

  return new Promise((resolve) => {
    const app = express();
    app.use(basePath, requestWithAgent, agentRouter);
    restServer = app.listen(port, () => {
      resolve(true);
    });
  });
};

export const tearDown = async (): Promise<boolean> => {
  await new Promise((resolve, reject) => restServer.close(resolve));
  try {
    await (await dbConnection).dropDatabase();
    await (await dbConnection).destroy();
  } catch (e) {
    // nop
  }
  try {
    fs.unlinkSync(databaseFile);
  } catch (e) {
    //nop
  }
  return true;
};
