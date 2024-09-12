import {
  IIdentifier,
  IDIDManager,
  TAgent,
  TKeyType,
  IKey,
} from '@vckit/core-types';
import { bytesToBase58, bytesToMultibase, hexToBytes } from '@veramo/utils';
import { Request, Router } from 'express';
import { ServiceEndpoint, VerificationMethod } from 'did-resolver';
import { Ed25519KeyPair, JsonWebKey2020 } from '@transmute/ed25519-key-pair';

interface RequestWithAgentDIDManager extends Request {
  agent?: TAgent<IDIDManager>;
}

/**
 * The URL path to the DID document, used by did:web when the identifier is a hostname.
 *
 * @public
 */
export const didDocEndpoint = '/.well-known/did.json';

const defaultKeyMapping: Record<TKeyType, string[]> = {
  Secp256k1: ['EcdsaSecp256k1VerificationKey2019'],
  Secp256r1: ['EcdsaSecp256r1VerificationKey2019'],
  Ed25519: ['Ed25519VerificationKey2020', 'JsonWebKey2020', 'Multikey'],
  X25519: ['X25519KeyAgreementKey2019'],
  Bls12381G1: ['Bls12381G1Key2020'],
  Bls12381G2: ['Bls12381G2Key2020'],
};

/**
 * @public
 */
export interface WebDidDocRouterOptions {
  services?: ServiceEndpoint[];
  keyMapping?: Record<TKeyType, string>;
}

/**
 * Creates a router that serves `did:web` DID Documents
 *
 * @param options - Initialization option
 * @returns Expressjs router
 *
 * @public
 */
export const WebDidDocRouter = (options: WebDidDocRouterOptions): Router => {
  const router = Router();

  const webKeysForIdentifier = async (identifier: IIdentifier) => {
    const key = identifier.keys.find((k) => k.type === 'Ed25519');
    if (!key) {
      throw new Error('JsonWebKey2020 requires Ed25519 key');
    }
    // key.kid =
    //   'bfd193662cf9ab7c7eabde2c14611bdb4aea266db20d1f13e4c1fc02159511c2';
    // key.publicKeyHex =
    //   'bfd193662cf9ab7c7eabde2c14611bdb4aea266db20d1f13e4c1fc02159511c2';
    const publicKeyBytes = hexToBytes(key.publicKeyHex);
    const publicKeyMultibase = bytesToMultibase(
      hexToBytes(key.publicKeyHex),
      'Ed25519'
    );

    const controller = `did:key:${publicKeyMultibase}`;
    const id = `${controller}#${publicKeyMultibase}`;

    const ed25519KeyPair = new Ed25519KeyPair({
      id: id,
      type: 'JsonWebKey2020',
      controller: controller,
      publicKey: publicKeyBytes,
    });

    const keys = await Promise.all(
      [
        ...((await ed25519KeyPair.getDerivedKeyPairs()) as Ed25519KeyPair[]),
      ].map(async (k: Ed25519KeyPair, i: number) => {
        const wk = await k.export({
          type: 'JsonWebKey2020',
          privateKey: false,
        });
        wk.id = `${identifier.did}#${key.kid}-key-${i}`;
        wk.controller = identifier.did;
        return wk;
      })
    );
    return keys as JsonWebKey2020[];
  };

  const didDocForIdentifier = async (identifier: IIdentifier) => {
    const contexts = new Set<string>();

    const allKeys: (VerificationMethod | VerificationMethod[])[] =
      await Promise.all(
        identifier.keys.flatMap(async (key: IKey) => {
          const supportedTypes = defaultKeyMapping[key.type] || [key.type]; // Get supported types for this key
          const verificationMethods: VerificationMethod[] = [];

          for (const type of supportedTypes) {
            const vm: VerificationMethod = {
              id: `${identifier.did}#${key.kid}`,
              type,
              controller: identifier.did,
              publicKeyHex: key.publicKeyHex,
            };

            switch (type) {
              case 'EcdsaSecp256k1VerificationKey2019':
              case 'EcdsaSecp256k1RecoveryMethod2020':
                contexts.add('https://w3id.org/security/v2');
                contexts.add(
                  'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
                );
                verificationMethods.push(vm);
                break;

              case 'Ed25519VerificationKey2018':
                contexts.add(
                  'https://w3id.org/security/suites/ed25519-2018/v1',
                );
                vm.publicKeyBase58 = bytesToBase58(
                  hexToBytes(key.publicKeyHex),
                );
                delete vm.publicKeyHex;
                verificationMethods.push(vm);
                break;

              case 'X25519KeyAgreementKey2019':
                contexts.add('https://w3id.org/security/suites/x25519-2019/v1');
                vm.publicKeyBase58 = bytesToBase58(
                  hexToBytes(key.publicKeyHex),
                );
                delete vm.publicKeyHex;
                verificationMethods.push(vm);
                break;

              case 'Ed25519VerificationKey2020':
                contexts.add(
                  'https://w3id.org/security/suites/ed25519-2020/v1',
                );
                vm.publicKeyMultibase = bytesToMultibase(
                  hexToBytes(key.publicKeyHex),
                  'Ed25519',
                );
                delete vm.publicKeyHex;
                verificationMethods.push(vm);
                break;

              case 'X25519KeyAgreementKey2020':
                contexts.add('https://w3id.org/security/suites/x25519-2020/v1');
                vm.publicKeyMultibase = bytesToMultibase(
                  hexToBytes(key.publicKeyHex),
                  'Ed25519',
                );
                delete vm.publicKeyHex;
                verificationMethods.push(vm);
                break;

              case 'EcdsaSecp256r1VerificationKey2019':
                contexts.add('https://w3id.org/security/v2');
                verificationMethods.push(vm);
                break;

              case 'Bls12381G1Key2020':
              case 'Bls12381G2Key2020':
                contexts.add('https://w3id.org/security/bbs/v1');
                verificationMethods.push(vm);
                break;

              case 'JsonWebKey2020':
                const webKeys = (await webKeysForIdentifier(identifier)).map(
                  (k, i) => ({
                    id: `${identifier.did}#${key.kid}-${type}-key-${i}`,
                    type: type,
                    controller: k.controller,
                    publicKeyJwk: k.publicKeyJwk,
                  }),
                );

                if (webKeys.length > 0) {
                  contexts.add('https://w3id.org/security/suites/jws-2020/v1');
                }

                verificationMethods.push(...webKeys);
                break;

              case 'Multikey':
                // This context is required for the Multikey verification type
                contexts.add('https://w3id.org/security/multikey/v1');

                /**
                 * The public key multibase must consist of a binary value that starts with the two-byte prefix '0xed01'
                 * For details see: https://www.w3.org/TR/vc-di-eddsa/#multikey
                 */
                const MULTICODEC_PUB_HEADER = new Uint8Array([0xed, 0x01]);
                const identifierWebKeys = (
                  await webKeysForIdentifier(identifier)
                ).map((k, i) => ({
                  id: `${identifier.did}#${key.kid}-${type}-key-${i}`,
                  type: type,
                  controller: k.controller,
                  publicKeyJwk: k.publicKeyJwk,
                  publicKeyMultibase: `z${bytesToBase58(
                    new Uint8Array([
                      ...MULTICODEC_PUB_HEADER,
                      ...hexToBytes(key.publicKeyHex),
                    ]),
                  )}`,
                  publicKeyBase58: bytesToBase58(hexToBytes(key.publicKeyHex)),
                }));

                verificationMethods.push(...identifierWebKeys);
                break;

              default:
                verificationMethods.push(vm);
                break;
            }
          }

          return verificationMethods;
        })
      );

    const flattenAllKeys: VerificationMethod[] = allKeys.flat();

    // ed25519 keys can also be converted to x25519 for key agreement
    const keyAgreementKeyIds = flattenAllKeys
      .filter((key) =>
        ['Ed25519VerificationKey2018', 'X25519KeyAgreementKey2019'].includes(
          key.type
        )
      )
      .map((key) => key.id);
    const signingKeyIds = flattenAllKeys
      .filter((key) => key.type !== 'X25519KeyAgreementKey2019')
      .map((key) => key.id);

    const didDoc = {
      '@context': ['https://www.w3.org/ns/did/v1', ...contexts],
      id: identifier.did,
      verificationMethod: flattenAllKeys,
      authentication: signingKeyIds,
      assertionMethod: signingKeyIds,
      keyAgreement: keyAgreementKeyIds,
      service: [...(options?.services || []), ...(identifier?.services || [])],
    };

    return didDoc;
  };

  const getAliasForRequest = (req: Request) => {
    return encodeURIComponent(req.get('host') || req.hostname);
  };

  router.get(didDocEndpoint, async (req: RequestWithAgentDIDManager, res) => {
    if (req.agent) {
      try {
        const serverIdentifier = await req.agent.didManagerGet({
          did: 'did:web:' + getAliasForRequest(req),
        });
        const didDoc = await didDocForIdentifier(serverIdentifier);
        res.json(didDoc);
      } catch (e) {
        res.status(404).send(e);
      }
    }
  });

  router.get(
    /^\/(.+)\/did.json$/,
    async (req: RequestWithAgentDIDManager, res) => {
      if (req.agent) {
        try {
          const identifier = await req.agent.didManagerGet({
            did:
              'did:web:' +
              getAliasForRequest(req) +
              ':' +
              req.params[0].replace(/\//g, ':'),
          });
          const didDoc = await didDocForIdentifier(identifier);
          res.json(didDoc);
        } catch (e) {
          res.status(404).send(e);
        }
      }
    }
  );

  router.get('/keys/:did', async (req: RequestWithAgentDIDManager, res) => {
    if (req.agent) {
      try {
        console.log(req.params);
        const identifier = await req.agent.didManagerGet({
          did: req.params.did,
        });
        const keys = await webKeysForIdentifier(identifier);
        res.json(keys);
      } catch (e) {
        res.status(404).send(e);
      }
    }
  });

  return router;
};
