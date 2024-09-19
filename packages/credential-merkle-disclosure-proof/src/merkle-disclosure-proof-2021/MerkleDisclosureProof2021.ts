import jsonld from 'jsonld';

import { JsonWebKey } from '@transmute/json-web-signature';

import * as normalizationOptions from './merkle/normalization/index.js';

import * as merkle from './merkle/suite/index.js';
import { expandDisclosureProof } from '@transmute/merkle-proof';

export class MerkleDisclosureProof2021 {
  public static type = 'MerkleDisclosureProof2021';
  public normalization: string = 'naive';
  protected key?: JsonWebKey;
  protected date?: string;
  protected verificationMethod?: string;
  private rootNonce?: string;

  constructor(options?: {
    key?: JsonWebKey;
    date?: string;
    normalization?: string;
    rootNonce?: string;
  }) {
    if (options) {
      this.rootNonce = options.rootNonce;
      const { key, date, normalization } = options;
      if (key && !(key as any).useJwa) {
        throw new Error('Key must support useJwa.');
      }

      if (normalization) {
        this.normalization = normalization;
      }
      this.key = key;
      this.date = date;
      if (this.key) {
        this.verificationMethod = this.key.id;
      }
    }
  }

  async createProof({ document, purpose, documentLoader }: any) {
    if (!this.key) {
      throw new Error('cannot create proof, suite has no signing key.');
    }
    const context = document['@context'];
    let proof: any = {
      '@context': context,
    };
    proof.type = MerkleDisclosureProof2021.type;
    if (this.date !== undefined) {
      proof.created = this.date;
    }
    if (!proof.created) {
      proof.created = new Date().toISOString();
    }
    if (this.verificationMethod !== undefined) {
      proof.verificationMethod = this.verificationMethod;
    }
    proof = await purpose.update(proof, {
      document,
      suite: this,
      documentLoader,
    });
    // the merkle root must cover the proof object... in addition to the document.

    const documentWithProof = await { ...document, proof };
    delete documentWithProof.proof['@context'];

    proof.normalization = this.normalization;

    const normalizedDocumentWithProof = await this.normalize({
      document: {
        ...documentWithProof,
      },
      documentLoader,
    });

    const merkleProof = await merkle.createProof(normalizedDocumentWithProof, {
      documentLoader,
      ...(normalizationOptions as any)[proof.normalization],
      rootNonce: this.rootNonce,
    });
    proof.proofs = merkleProof.proofs;
    const { root } = expandDisclosureProof(
      Buffer.from(merkleProof.proofs, 'base64')
    );

    const signer = this.key.signer();
    const signature = await signer.sign({
      data: root.toString('base64'),
    });
    proof.jws = signature;
    delete proof['@context'];
    delete proof.id;
    return proof;
  }

  async normalize(options: any) {
    const { document, documentLoader } = options;
    const context = document['@context'];
    const messages = await (normalizationOptions as any)[
      this.normalization
    ].objectToMessages(document, { documentLoader });

    const object = await (normalizationOptions as any)[
      this.normalization
    ].messagesToObject(messages, { context, documentLoader });

    return object;
  }

  async deriveProof(options: {
    inputDocumentWithProof: any;
    outputDocument: any;
    documentLoader?: any;
    rootNonce?: string;
  }): Promise<{ document: any; proof: any }> {
    const { inputDocumentWithProof, outputDocument } = options;

    const { proof, ...inputDocument } = inputDocumentWithProof;

    const partialProof = { ...proof };
    delete partialProof.proofs;
    delete partialProof.jws;
    delete partialProof.rootNonce;

    const result = await merkle.deriveProof(
      { ...outputDocument, proof: partialProof },
      { ...inputDocument, proof: partialProof },
      proof,
      {
        ...options,
        ...(normalizationOptions as any)[proof.normalization],
      } as any
    );

    return result;
  }

  async verifyProof(
    options: any
  ): Promise<{ verified: boolean; verificationMethod?: any; error?: any }> {
    const { document, proof, documentLoader } = options;

    const key = await this.getVerificationMethod({
      proof,
      documentLoader,
      instance: true,
    });

    const verifier = key.verifier();

    const { jws, proofs, normalization } = proof;

    const isMerkleRootSignedByVerificationMethod = await verifier.verify({
      signature: jws,
    });

    if (!isMerkleRootSignedByVerificationMethod) {
      throw new Error(`Merkle root not signed by ${proof.verificationMethod}`);
    }

    const signedMerkleRoot = Buffer.from(
      Buffer.from(proof.jws.split('.')[1], 'base64').toString(),
      'base64'
    ).toString('hex');

    const documentWithProof = {
      ...document,
      proof: { ...proof },
    };

    delete documentWithProof.proof['@context'];
    delete documentWithProof.proof.proofs;
    delete documentWithProof.proof.jws;

    try {
      // beware that a holder may choose not to disclose proof purpose, or created.
      const isMerkProofValid = await merkle.verifyProof(
        { ...documentWithProof },
        {
          root: signedMerkleRoot,
          proofs: proofs,
        },
        {
          documentLoader,
          ...(normalizationOptions as any)[normalization],
        }
      );

      return { ...isMerkProofValid, verificationMethod: key };
    } catch (e) {
      console.log(e);
      return { verified: false };
    }
  }

  async getVerificationMethod({
    proof,
    documentLoader,
    instance,
  }: any): Promise<any> {
    let { verificationMethod } = proof;

    if (typeof verificationMethod === 'object') {
      verificationMethod = verificationMethod.id;
    }

    if (!verificationMethod) {
      throw new Error('No "verificationMethod" found in proof.');
    }

    // Note: `expansionMap` is intentionally not passed; we can safely drop
    // properties here and must allow for it
    const { document } = await documentLoader(verificationMethod);
    const framed = await jsonld.frame(
      verificationMethod,
      {
        '@context': document['@context'],
        '@embed': '@always',
        id: verificationMethod,
      },
      {
        // use the cache of the document we just resolved when framing
        documentLoader: (iri: string) => {
          if (iri.startsWith(document.id)) {
            return {
              documentUrl: iri,
              document,
            };
          }
          return documentLoader(iri);
        },
      }
    );

    if (!framed || !framed.controller) {
      throw new Error(`Verification method ${verificationMethod} not found.`);
    }

    // ensure verification method has not been revoked
    if (framed.revoked !== undefined) {
      throw new Error('The verification method has been revoked.');
    }

    if (!instance) {
      return framed;
    }

    return JsonWebKey.from(framed, { detached: false });
  }
}
