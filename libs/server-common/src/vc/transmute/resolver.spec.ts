import * as didKey from '@transmute/did-key.js';
import * as didWeb from '@transmute/did-web';
import axios from 'axios';
import { resolvers } from './resolvers';

jest.mock('axios');
jest.mock('@transmute/did-key.js');
jest.mock('@transmute/did-web');

describe('resolvers', () => {
  describe('http', () => {
    it('should make http get request for a given url', async () => {
      const url = 'http://fetch.url';
      const getRequest = axios.get as jest.Mock;
      getRequest.mockImplementation(() =>
        Promise.resolve({
          data: {
            id: 'test',
          },
        })
      );
      const res = await resolvers.http(url);
      expect(res['id']).toBe('test');
    });
  });

  describe('resolve', () => {
    it('should call transmute did key resolve for did:key', async () => {
      const resolve = didKey.resolve as jest.Mock;
      const didDocument = {
        id: 'test',
      };
      resolve.mockImplementation(() =>
        Promise.resolve({
          didDocument,
        })
      );
      const res = await resolvers.resolve(
        'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd'
      );
      expect(res).toEqual(didDocument);
    });
    it('should call transmute did web resolve for did:web', async () => {
      const resolve = didWeb.resolve as jest.Mock;
      const didDocument = {
        id: 'test',
      };
      resolve.mockImplementation(() => Promise.resolve(didDocument));
      const res = await resolvers.resolve('did:web:http://example.com');
      expect(res).toEqual(didDocument);
    });
  });
});
