import { contexts } from '@transmute/did-context';
import { resolvers } from './resolvers';

export const documentLoader = async (iri: string) => {
  if (iri) {
    if (contexts.get(iri)) {
      return { document: contexts.get(iri) };
    }

    if (iri.startsWith('did:')) {
      const didDocument = await resolvers.resolve(iri);
      return { document: didDocument };
    }

    if (iri.startsWith('http')) {
      const document = await resolvers.http(iri);
      return { document };
    }
  }

  const message = 'Unsupported iri: ' + iri;
  throw new Error(message);
};
