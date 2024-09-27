import { jest } from '@jest/globals';
import { DataSource, EntityManager } from 'typeorm';
import { OrPromise } from '@veramo/utils';
import { BitstringStatusList } from '../src/bitstring-status-list';

describe('bitstring status list', () => {
  let bitstringStatusList: BitstringStatusList;
  beforeEach(() => {
    bitstringStatusList = new BitstringStatusList({
      dbConnection: {
        initialize(): Promise<void> {
          return Promise.resolve();
        },
      } as unknown as OrPromise<DataSource>,
      bitstringDomainURL: 'http://example.com',
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid result when issue a bitstring status list', async () => {
    // mock data from database
    jest
      .spyOn(
        bitstringStatusList['store'],
        'runTransactionWithExponentialBackoff',
      )
      .mockImplementation(async (cb) => {
        await cb({
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockReturnValue({}),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue({}),
              }),
              setLock: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                  getExists: jest.fn().mockReturnValue({}),
                }),
              }),
            }),
            save: jest.fn().mockReturnValue({
              id: '3',
              statusListCredential:
                'http://example.com/credentials/status/bitstring-status-list/3',
              lastStatusIndex: 94567,
              statusSize: 19987,
            }),
          }),
        } as unknown as EntityManager);
      });

    const context = {
      agent: {
        execute: jest.fn().mockImplementation(() => {
          return { did: 'http://example.com' };
        }),
      },
    };

    const args = {
      bitstringDomainURL: 'http://example.com',
      statusPurpose: 'revocation',
      bitStringLength: 10,
      bitstringStatusIssuer: 'http://example.com',
    };

    const issueBitstringStatusList =
      await bitstringStatusList.issueBitstringStatusList(args, context);

    expect(issueBitstringStatusList).toEqual({
      id: 'http://example.com/credentials/status/bitstring-status-list/3#94567',
      type: 'BitstringStatusListEntry',
      statusPurpose: 'revocation',
      statusListIndex: 94567,
      statusListCredential:
        'http://example.com/credentials/status/bitstring-status-list/3',
    });
  });

  //error case
  it('should show error when issuer invalid in issue a bitstring status list', async () => {
    // mock data from database
    jest
      .spyOn(
        bitstringStatusList['store'],
        'runTransactionWithExponentialBackoff',
      )
      .mockImplementation(async (cb) => {
        await cb({
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockReturnValue({}),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue({}),
              }),
              setLock: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                  getExists: jest.fn().mockReturnValue({}),
                }),
              }),
            }),
            save: jest.fn().mockReturnValue({
              id: '3',
              statusListCredential:
                'http://example.com/credentials/status/bitstring-status-list/3',
              lastStatusIndex: 94567,
              statusSize: 19987,
            }),
          }),
        } as unknown as EntityManager);
      });

    const context = {
      agent: {},
    };

    const args = {
      bitstringDomainURL: 'http://example.com',
      statusPurpose: 'revocation',
      bitStringLength: 10,
      bitstringStatusIssuer: 'http://example.com',
    };

    expect(async () => {
      await bitstringStatusList.issueBitstringStatusList(args, context);
    }).rejects.toThrow(
      'invalid_argument: credential.issuer must be a DID managed by this agent.',
    );
  });

  // TODO: refactor the test and add more test cases
  it.skip('should show error when the status purpose of the credential does not match the status purpose of the status list credential', async () => {
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/vc-revocation-list-2020/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
        'https://dev-render-method-context.s3.ap-southeast-1.amazonaws.com/dev-render-method-context.json',
        'https://dpp-json-ld.s3.ap-southeast-2.amazonaws.com/dppld.json',
      ],
      type: ['VerifiableCredential', 'DigitalProductPassport'],
      issuer: {
        id: 'did:key:z6MkntyzeHyJRmoLSTDt2fzwHhNbpihQinae7HzA33oesY2g',
      },
      credentialSubject: {
        sustainabilityScore: 99,
      },
      credentialStatus: {
        id: 'http://example.com/credentials/status/bitstring-status-list/3#94567',
        type: 'BitstringStatusListEntry',
        statusPurpose: 'revocation',
        statusListIndex: 94567,
        statusListCredential:
          'http://example.com/credentials/status/bitstring-status-list/3',
      },
      render: [
        {
          template: '<p>Render dpp template</p>',
          '@type': 'WebRenderingTemplate2022',
        },
      ],
      issuanceDate: '2024-04-24T07:20:08.646Z',
      proof: {
        type: 'Ed25519Signature2018',
        created: '2024-04-24T08:16:55Z',
        verificationMethod:
          'did:key:z6MkntyzeHyJRmoLSTDt2fzwHhNbpihQinae7HzA33oesY2g#z6MkntyzeHyJRmoLSTDt2fzwHhNbpihQinae7HzA33oesY2g',
        proofPurpose: 'assertionMethod',
        jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..rneN9NpHFeeelxkR3QNsapLKfmbEMBpQtzW-OadVgYiCBwgKkPmtw6D8Rz75j-_gMVL4Ar4cX_j9qAep_qBgAQ',
      },
    };

    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          headers: {
            get: (name: string) => 'application/json',
          },
          json: () =>
            Promise.resolve({
              '@context': ['https://www.w3.org/ns/credentials/v2'],
              id: 'https://example.com/credentials/status/3',
              type: ['VerifiableCredential', 'BitstringStatusListCredential'],
              issuer: 'did:example:12345',
              validFrom: '2021-04-05T14:27:40Z',
              credentialSubject: {
                id: 'https://example.com/status/3#list',
                type: 'RevocationList2020Status',
              },
            }),
        }) as Promise<Response>,
    );

    const result = await bitstringStatusList.checkBitstringStatus(
      { verifiableCredential: credential },
      {},
    );

    expect(result).toEqual({
      revoked: true,
      errors: [
        {
          id: 'http://example.com/credentials/status/bitstring-status-list/3#94567',
          message:
            'The status purpose of the credential does not match the status purpose of the status list credential.',
        },
      ],
    });
  });
});
