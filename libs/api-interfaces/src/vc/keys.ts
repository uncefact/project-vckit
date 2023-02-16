// borrowed from @transmute/did-key.js/dist/index.d.ts

export interface PublicKeyJwk {
  kty: 'EC' | 'OKP';
  crv: 'Ed25519' | 'X25519' | 'P-256' | 'P-384' | 'secp256k1';
  x: string;
  y?: string;
}

export interface PrivateKeyJwk extends PublicKeyJwk {
  d: string;
}

export interface KeyCommonProps {
  id: string;
  type: string;
  controller: string;
}

export interface JwkPairCommonProps {
  publicKeyJwk: any;
  privateKeyJwk: any;
}

export interface LdPairCommonProps {
  publicKeyBase58: string;
  privateKeyBase58: string;
}

export interface JwkKeyPair extends KeyCommonProps, JwkPairCommonProps {}
export interface LdKeyPair extends KeyCommonProps, LdPairCommonProps {}
export type DidKey = JwkKeyPair | LdKeyPair;

export interface DidDocument {
  id: string;
  verificationMethod: any[];
}

export interface DidGeneration {
  didDocument: DidDocument;
  keys: DidKey[];
}
