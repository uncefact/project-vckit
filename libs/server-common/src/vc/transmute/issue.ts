import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018,
} from '@transmute/ed25519-signature-2018';

import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';
import { EcdsaSecp256k1VerificationKey2019 } from '@transmute/secp256k1-key-pair';

import { DidKey, VerifiableCredential } from '@dvp/api-interfaces';
import { verifiable } from '@transmute/vc.js';
import { BadRequestError } from '../../error';
import { documentLoader } from './documentLoader';
import { getKeysForMnemonic } from './keys';

export interface IssueCredentialOptions {
  /**
   *  A JSON-LD Verifiable Credential without a proof.
   */
  credential: VerifiableCredential;

  /**
   *  Mnemonic code for generating deterministic keys
   */
  mnemonic: string;
  proofType?: string;
  hdpath?: string;
  keyType?: string;

  format?: 'vc' | 'vc-jwt';
}

export const getSuite = async (
  key: DidKey,
  proofType = 'Ed25519Signature2018'
) => {
  if (proofType === 'Ed25519Signature2018') {
    return new Ed25519Signature2018({
      key: await Ed25519VerificationKey2018.from(key),
    });
  }

  if (proofType === 'JsonWebSignature2020') {
    return new JsonWebSignature({
      key: await JsonWebKey.from(key as EcdsaSecp256k1VerificationKey2019),
    });
  }
  throw new BadRequestError(new Error(`Unsupported proof type: ${proofType}`));
};

export const getCredentialSuite = async ({
  credential,
  mnemonic,
  hdpath,
  proofType = 'Ed25519Signature2018',
  keyType = 'ed25519',
}: IssueCredentialOptions) => {
  const keys = await getKeysForMnemonic(keyType, mnemonic, hdpath);
  if (typeof credential.issuer !== 'string' && credential?.issuer?.id) {
    credential.issuer.id = keys[0].controller;
  } else {
    credential.issuer = keys[0].controller;
  }

  // we are exploiting the known structure of did:key here...
  const suite = await getSuite(keys[0], proofType);
  return suite;
};

export const issueCredential = async ({
  credential,
  mnemonic,
  hdpath,
  proofType,
  keyType = 'ed25519',
  format = 'vc',
}: IssueCredentialOptions) => {
  const suite = await getCredentialSuite({
    credential,
    mnemonic,
    keyType,
    hdpath,
    proofType,
  });

  if (
    proofType === 'JsonWebSignature2020' &&
    format === 'vc' &&
    !credential['@context'].includes(
      'https://w3id.org/security/suites/jws-2020/v1'
    )
  ) {
    credential['@context'].push('https://w3id.org/security/suites/jws-2020/v1');
  }

  if (!credential.issuer) {
    credential.issuer = suite.key.controller;
  }

  if (format === 'vc-jwt') {
    credential['@context'].push('https://www.w3.org/2018/credentials/v1');
  }
  try {
    const { items } = await verifiable.credential.create({
      credential,
      suite,
      documentLoader,
      format: [format],
    });
    return items[0];
  } catch (err) {
    if (
      err instanceof Error &&
      err?.message?.includes('credential is not valid JSON-LD')
    ) {
      throw new BadRequestError(err);
    }
    throw err;
  }
};
