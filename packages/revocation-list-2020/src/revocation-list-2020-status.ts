import { CredentialJwtOrJSON } from 'credential-status';
import { checkStatus as transmuteCheckStatus } from '@transmute/vc-status-rl-2020';
import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';
import { JsonWebSignature } from '@transmute/json-web-signature';
import { contexts } from '@transmute/did-context/index.js';
import { DocumentLoader } from '@transmute/vc-status-rl-2020/dist/types';
import * as didKey from '@transmute/did-key.js';
import * as didWeb from '@transmute/did-web';
import { CredentialStatus } from '@vckit/core-types';
import { LdDefaultContexts } from '@veramo/credential-ld';
import { RevocationListDefaultContexts } from './revocaltion-list-default-contexts.js';
import { RenderDefaultContexts } from '@vckit/renderer';

const resolve = async (did: string) => {
  if (did.startsWith('did:key')) {
    const { didDocument } = await didKey.resolve(did.split('#')[0], {
      accept: 'application/did+json',
    });
    return didDocument;
  }
  if (did.startsWith('did:web')) {
    return didWeb.resolve(did);
  }
  throw new Error('Unsupported did method');
};

const documentLoader: DocumentLoader = async (iri: string) => {
  if (iri) {
    if (contexts.get(iri)) {
      return { documentUrl: iri, document: contexts.get(iri) };
    }

    if (LdDefaultContexts.get(iri)) {
      return { documentUrl: iri, document: LdDefaultContexts.get(iri) };
    }

    if (RevocationListDefaultContexts.get(iri)) {
      return {
        documentUrl: iri,
        document: RevocationListDefaultContexts.get(iri),
      };
    }

    if (RenderDefaultContexts.get(iri)) {
      return { documentUrl: iri, document: RenderDefaultContexts.get(iri) };
    }

    if (iri.startsWith('did:')) {
      const didDocument = await resolve(iri);
      return { documentUrl: iri, document: didDocument };
    }

    if (iri.startsWith('http')) {
      const document = await fetch(iri).then((res) => res.json());
      return { documentUrl: iri, document };
    }
  }

  const message = 'Unsupported iri: ' + iri;
  throw new Error(message);
};

/**
 * @public
 *
 */
export async function checkStatus(credential: CredentialJwtOrJSON) {
  const result = await transmuteCheckStatus({
    credential,
    documentLoader,
    suite: [new Ed25519Signature2018(), new JsonWebSignature()],
  });

  const status: CredentialStatus = {
    revoked: !result.verified,
  };
  return status;
}
