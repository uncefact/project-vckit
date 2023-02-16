import { constants, contexts } from '@transmute/did-context';
import { DidDocument } from '@transmute/jsonld-document-loader';

import { documentLoader } from './documentLoader';
import { resolvers } from './resolvers';

describe('documentLoader', () => {
  it('should return an error for unsupported did', async () => {
    await expect(documentLoader('fake')).rejects.toThrow(
      `Unsupported iri: fake`
    );
  });
  it('should fetch did document from static contexts if exists', async () => {
    const res = await documentLoader(constants.DID_CONTEXT_TRANSMUTE_V1_URL);
    expect(res).toEqual({
      document: contexts.get(constants.DID_CONTEXT_TRANSMUTE_V1_URL),
    });
  });

  it('should fetch did document for did key', async () => {
    const didKey = 'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd';

    const didDocument: DidDocument = {
      id: didKey,
    };

    const mockResolve = jest
      .spyOn(resolvers, 'resolve')
      .mockResolvedValue(didDocument);
    const res = await documentLoader(didKey);
    expect(res).toEqual({
      document: didDocument,
    });
    expect(mockResolve).toBeCalledWith(didKey);
  });

  it('should fetch did document for did web', async () => {
    const didWeb = 'did:web:example.com';

    const didDocument: DidDocument = {
      id: didWeb,
    };
    const mockResolve = jest
      .spyOn(resolvers, 'resolve')
      .mockResolvedValue(didDocument);
    const res = await documentLoader(didWeb);
    expect(res).toEqual({
      document: didDocument,
    });
    expect(mockResolve).toBeCalledWith(didWeb);
  });

  it('should fetch did document from an external source', async () => {
    const did = 'http:example.com';

    const didDocument = {
      id: did,
    };
    const mockHttp = jest
      .spyOn(resolvers, 'http')
      .mockResolvedValue(didDocument as DidDocument);
    const res = await documentLoader(did);
    expect(res).toEqual({
      document: didDocument,
    });
    expect(mockHttp).toBeCalledWith(did);
  });
});
