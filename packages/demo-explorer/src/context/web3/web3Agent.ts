import {
  createAgent,
  ICredentialPlugin,
  IDIDManager,
  IKeyManager,
  IResolver,
} from '@vckit/core'
import { CredentialPlugin, W3cMessageHandler } from '@vckit/credential-w3c'
import {
  CredentialIssuerEIP712,
  ICredentialIssuerEIP712,
} from '@veramo/credential-eip712'
import { AbstractIdentifierProvider, DIDManager } from '@veramo/did-manager'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager } from '@veramo/key-manager'
import { SdrMessageHandler } from '@veramo/selective-disclosure'
import { JwtMessageHandler } from '@veramo/did-jwt'
import { MessageHandler } from '@veramo/message-handler'
import { Web3KeyManagementSystem } from '@veramo/kms-web3'

import {
  DataStoreJson,
  DIDStoreJson,
  KeyStoreJson,
  BrowserLocalStorageStore,
  PrivateKeyStoreJson,
} from '@veramo/data-store-json'

import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import {
  PeerDIDProvider,
  getResolver as peerDidResolver,
} from '@veramo/did-provider-peer'
import { MinimalImportableKey } from '@vckit/core'
import {
  DIDComm,
  DIDCommHttpTransport,
  DIDCommMessageHandler,
  CoordinateMediationRecipientMessageHandler,
  PickupRecipientMessageHandler,
} from '@veramo/did-comm'
import { Web3Provider } from '@ethersproject/providers'
import { KeyManagementSystem } from '@veramo/kms-local'
import { SaveMessageHandler } from './saveMessageHandler'
import {
  IdentifierProfilePlugin,
  IIdentifierProfilePlugin,
} from '../plugins/IdentifierProfile'
import { DIDDiscovery } from '@veramo/did-discovery'
// FIXME: This import causes an error: Module not found: Error: Can't resolve 'react-native-sqlite-storage' in '[...]/node_modules/typeorm/browser/driver/react-native'
// import { DataStoreDiscoveryProvider } from '@veramo/data-store'
import { DataStoreDiscoveryProvider } from '../plugins/did-discovery-provider'
import { AliasDiscoveryProvider } from '../plugins/AliasDiscoveryProvider'

const dataStore = BrowserLocalStorageStore.fromLocalStorage('veramo-state')
const identifierDataStore =
  BrowserLocalStorageStore.fromLocalStorage('veramo-id-state')
const infuraProjectId = '3586660d179141e3801c3895de1c2eba'

export interface ConnectorInfo {
  provider: Web3Provider
  chainId: number
  accounts: string[]
  name: string
  isActive: boolean
}

export async function createWeb3Agent({
  connectors,
}: {
  connectors: ConnectorInfo[]
}) {
  const didProviders: Record<string, AbstractIdentifierProvider> = {}
  const web3Providers: Record<string, Web3Provider> = {}

  connectors.forEach((info) => {
    didProviders[info.name] = new EthrDIDProvider({
      defaultKms: 'web3',
      network: info.chainId,
      web3Provider: info.provider,
    })
    web3Providers[info.name] = info.provider
  })
  didProviders['did:peer'] = new PeerDIDProvider({ defaultKms: 'local' })

  const id = 'web3Agent'
  const agent = createAgent<
    IDIDManager &
      IKeyManager &
      IResolver &
      ICredentialIssuerEIP712 &
      ICredentialPlugin &
      IIdentifierProfilePlugin &
      DIDDiscovery
  >({
    context: {
      id,
      name: `Browser`,
    },
    plugins: [
      new DIDResolverPlugin({
        resolver: new Resolver({
          ethr: ethrDidResolver({
            infuraProjectId,
          }).ethr,
          web: webDidResolver().web,
          peer: peerDidResolver().peer,
        }),
      }),
      new KeyManager({
        store: new KeyStoreJson(identifierDataStore),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStoreJson(identifierDataStore),
          ),
          web3: new Web3KeyManagementSystem(web3Providers),
        },
      }),
      new DIDManager({
        store: new DIDStoreJson(identifierDataStore),
        defaultProvider: connectors[0]?.name,
        providers: didProviders,
      }),
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new DataStoreJson(dataStore),
      new MessageHandler({
        messageHandlers: [
          new DIDCommMessageHandler(),
          new SaveMessageHandler(),
          new CoordinateMediationRecipientMessageHandler(),
          new PickupRecipientMessageHandler(),
          new JwtMessageHandler(),
          new W3cMessageHandler(),
          new SdrMessageHandler(),
        ],
      }),
      new DIDComm([new DIDCommHttpTransport()]),
      new IdentifierProfilePlugin(),
      new DIDDiscovery({
        providers: [
          new AliasDiscoveryProvider(),
          new DataStoreDiscoveryProvider(),
        ],
      }),
    ],
  })

  // commented out in https://github.com/veramolabs/agent-explorer/pull/115/files
  // was causing locally-managed X25519 keys to be deleted on page refresh
  // const identifiers = await agent.didManagerFind()
  // for (const identifier of identifiers) {
  //   if (identifier.keys.filter((key) => key.kms !== 'web3').length === 0) {
  //     await agent.didManagerDelete({ did: identifier.did })
  //   }
  // }

  for (const info of connectors) {
    if (info.accounts) {
      for (const account of info.accounts) {
        const did = `did:ethr:0x${info.chainId.toString(16)}:${account}`

        let extraManagedKeys = []
        for (const keyId in dataStore.keys) {
          if (
            dataStore.keys[keyId].meta?.did === did &&
            dataStore.keys[keyId].kms === 'local'
          ) {
            extraManagedKeys.push(dataStore.keys[keyId])
          }
        }
        extraManagedKeys = extraManagedKeys.map((k) => {
          const privateKeyHex = dataStore.privateKeys[k.kid].privateKeyHex
          return {
            ...k,
            privateKeyHex,
          }
        })

        // const controllerKeyId = `${did}#controller`
        const controllerKeyId = `${info.name}-${account}`
        await agent.didManagerImport({
          did,
          provider: info.name,
          controllerKeyId,
          keys: [
            {
              kid: controllerKeyId,
              type: 'Secp256k1',
              kms: 'web3',
              privateKeyHex: '',
              meta: {
                provider: info.name,
                account: account.toLocaleLowerCase(),
                algorithms: ['eth_signMessage', 'eth_signTypedData'],
              },
            } as MinimalImportableKey,
            ...extraManagedKeys,
          ],
        })
      }
    }
  }

  return agent
}
