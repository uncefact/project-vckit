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

const keyMapping: Record<TKeyType, string> = {
  Secp256k1: 'EcdsaSecp256k1VerificationKey2019',
  Secp256r1: 'EcdsaSecp256r1VerificationKey2019',
  Ed25519: 'Ed25519VerificationKey2018',
  X25519: 'X25519KeyAgreementKey2019',
  Bls12381G1: 'Bls12381G1Key2020',
  Bls12381G2: 'Bls12381G2Key2020',
};

/**
 * @public
 */
export interface WebDidDocRouterOptions {
  services?: ServiceEndpoint[];
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
    const allKeys: VerificationMethod[] = identifier.keys
      .filter((k) => k.type !== 'Ed25519' || identifier.provider !== 'did:web')
      .map((key: IKey) => {
        const vm: VerificationMethod = {
          id: identifier.did + '#' + key.kid,
          type: keyMapping[key.type],
          controller: identifier.did,
          publicKeyHex: key.publicKeyHex,
        };

        switch (vm.type) {
          case 'EcdsaSecp256k1VerificationKey2019':
          case 'EcdsaSecp256k1RecoveryMethod2020':
            contexts.add('https://w3id.org/security/v2');
            contexts.add(
              'https://w3id.org/security/suites/secp256k1recovery-2020/v2'
            );
            break;
          case 'Ed25519VerificationKey2018':
            contexts.add('https://w3id.org/security/suites/ed25519-2018/v1');
            vm.publicKeyBase58 = bytesToBase58(hexToBytes(key.publicKeyHex));
            delete vm.publicKeyHex;
            break;
          case 'X25519KeyAgreementKey2019':
            contexts.add('https://w3id.org/security/suites/x25519-2019/v1');
            vm.publicKeyBase58 = bytesToBase58(hexToBytes(key.publicKeyHex));
            delete vm.publicKeyHex;
            break;
          case 'Ed25519VerificationKey2020':
            contexts.add('https://w3id.org/security/suites/ed25519-2020/v1');
            vm.publicKeyMultibase = bytesToMultibase(
              hexToBytes(key.publicKeyHex),
              'Ed25519'
            );
            delete vm.publicKeyHex;
            break;
          case 'X25519KeyAgreementKey2020':
            contexts.add('https://w3id.org/security/suites/x25519-2020/v1');
            vm.publicKeyMultibase = bytesToMultibase(
              hexToBytes(key.publicKeyHex),
              'Ed25519'
            );
            delete vm.publicKeyHex;
            break;
          case 'EcdsaSecp256r1VerificationKey2019':
            contexts.add('https://w3id.org/security/v2');
            break;
          case 'Bls12381G1Key2020':
          case 'Bls12381G2Key2020':
            contexts.add('https://w3id.org/security/bbs/v1');
            break;

          default:
            break;
        }
        return vm;
      });

    const webKeys = (await webKeysForIdentifier(identifier)).map((k) => {
      return {
        id: k.id,
        type: k.type,
        controller: k.controller,
        publicKeyJwk: k.publicKeyJwk,
      } as VerificationMethod;
    });

    if (webKeys.length > 0) {
      contexts.add('https://w3id.org/security/suites/jws-2020/v1');
    }

    allKeys.push(...webKeys);

    // ed25519 keys can also be converted to x25519 for key agreement
    const keyAgreementKeyIds = allKeys
      .filter((key) =>
        ['Ed25519VerificationKey2018', 'X25519KeyAgreementKey2019'].includes(
          key.type
        )
      )
      .map((key) => key.id);
    const signingKeyIds = allKeys
      .filter((key) => key.type !== 'X25519KeyAgreementKey2019')
      .map((key) => key.id);

    const didDoc = {
      '@context': ['https://www.w3.org/ns/did/v1', ...contexts],
      id: identifier.did,
      verificationMethod: allKeys,
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

  return router;
};
