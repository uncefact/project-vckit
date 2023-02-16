import * as didKey from '@transmute/did-key.js';
import * as didWeb from '@transmute/did-web';
import type { DidDocument } from '@transmute/jsonld-document-loader';

import axios from 'axios';

export const resolvers = {
  http: async (url: string) => {
    const resp = await axios.get<DidDocument>(url, {
      headers: {
        accept: 'application/json',
      },
    });
    return resp.data;
  },
  resolve: async (did: string) => {
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
  },
};
