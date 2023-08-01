import {
  RevocationList2020,
  createCredential,
  createList,
  decodeList,
} from '@transmute/vc-status-rl-2020';
import {
  IAgent,
  IIdentifier,
  IRevocationListDataArgs,
} from '@vckit/core-types';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import {
  RevocationData,
  RevocationList,
} from '../entities/revocation-list-2020-data.js';
import { getConnectedDb } from '../utils.js';

/**
 * @public
 */
export class RevocationDataStore {
  constructor(private dbConnection: OrPromise<DataSource>) {}

  async createRevocationListVC(
    revocationListFullUrlPath: string,
    bitStringLengthOrList: number | RevocationList2020,
    revocationVCIssuer: string,
    context: { agent?: IAgent }
  ): Promise<any> {
    try {
      if (!context.agent) {
        throw Error('Agent not available');
      }
      let list: RevocationList2020;
      if (typeof bitStringLengthOrList === 'number') {
        list = await createList({ length: bitStringLengthOrList });
      } else {
        list = bitStringLengthOrList;
      }

      const credentialList = await createCredential({
        id: revocationListFullUrlPath,
        list,
      });

      // @ts-ignore
      credentialList.issuer = revocationVCIssuer;

      // Issue RevocationList VC
      const revocationList = await context.agent.execute(
        'createVerifiableCredential',
        {
          credential: credentialList,
          proofFormat: 'lds',
          fetchRemoteContexts: true,
        }
      );

      return revocationList;
    } catch (err) {
      throw err;
    }
  }

  async getRevocationData(
    args: IRevocationListDataArgs
  ): Promise<{ revocationListFullUrl: string; indexCounter: number }> {
    try {
      const {
        revocationListPath: revocationListUrlPath,
        revocationVCIssuer,
        bitStringLength,
        req,
      } = args;

      let revocationVCIdentifier: IIdentifier;
      try {
        revocationVCIdentifier = (await req.agent?.execute('didManagerGet', {
          did: revocationVCIssuer,
        })) as IIdentifier;
      } catch (e) {
        throw new Error(
          `invalid_argument: credential.issuer must be a DID managed by this agent.`
        );
      }
      const revocationVCIssuerDid = revocationVCIdentifier.did.replaceAll(
        ':',
        '_'
      );

      const db = await getConnectedDb(this.dbConnection);

      let revocationData = await db.getRepository(RevocationData).findOne({
        where: {
          revocationListUrlPath,
          revocationVCIssuer: revocationVCIdentifier.did,
        },
      });

      if (!revocationData) {
        revocationData = await db.getRepository(RevocationData).save({
          revocationListUrlPath,
          revocationVCIssuer: revocationVCIdentifier.did,
          bitStringLength: Number(bitStringLength),
        });
      }

      const revocationListFullUrlPath = `/credentials/status/revocation-list-2020/${revocationVCIssuerDid}/${revocationData.listCounter}`;

      let revocationList = await db.getRepository(RevocationList).findOne({
        where: {
          revocationListFullUrlPath,
          revocationVCIssuer: revocationVCIdentifier.did,
        },
      });

      // Not available - create one
      if (!revocationList) {
        revocationList = await this.createRevocationListVC(
          `${revocationListUrlPath}${revocationListFullUrlPath}`,
          Number(bitStringLength),
          revocationVCIssuer,
          req
        );

        await db.getRepository(RevocationList).save({
          revocationListFullUrlPath,
          revocationVCIssuer: revocationVCIdentifier.did,
          verifiableCredential: JSON.stringify(revocationList),
        });
      }

      await this.updateRevocationData({
        revocationData,
        revocationVCIssuerDid,
        args,
      });

      return {
        revocationListFullUrl: `${revocationListUrlPath}${revocationListFullUrlPath}`,
        indexCounter: revocationData.indexCounter,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateRevocationData({
    revocationData,
    revocationVCIssuerDid,
    args,
  }: {
    revocationData: RevocationData;
    revocationVCIssuerDid: string;
    args: IRevocationListDataArgs;
  }): Promise<void> {
    try {
      const db = await getConnectedDb(this.dbConnection);

      let nextIndex = revocationData.indexCounter + 1;
      let nextList = revocationData.listCounter;
      let nextBitStringLength = revocationData.bitStringLength;

      // Check if we need to update the bit string length
      if (
        Number(args.bitStringLength) != revocationData.bitStringLength ||
        nextIndex >= revocationData.bitStringLength
      ) {
        nextList += 1;
        nextIndex = 0;

        if (Number(args.bitStringLength) != revocationData.bitStringLength) {
          nextBitStringLength = Number(args.bitStringLength);
        }

        const revocationListFullUrlPath = `/credentials/status/revocation-list-2020/${revocationVCIssuerDid}/${nextList}`;

        const revocationList = await this.createRevocationListVC(
          `${args.revocationListPath}${revocationListFullUrlPath}`,
          Number(args.bitStringLength),
          args.revocationVCIssuer,
          args.req
        );

        const data = await db.getRepository(RevocationList).save({
          revocationListFullUrlPath,
          revocationVCIssuer: args.revocationVCIssuer,
          verifiableCredential: JSON.stringify(revocationList),
        });
        const vc = JSON.parse(data.verifiableCredential);
      }

      const d = await db.getRepository(RevocationData).save({
        ...revocationData,
        revocationListUrlPath: revocationData.revocationListUrlPath,
        revocationVCIssuer: args.revocationVCIssuer,
        indexCounter: nextIndex,
        listCounter: nextList,
        bitStringLength: nextBitStringLength,
      });
    } catch (err) {
      // Handle Errors here
      throw new Error(err);
    }
  }

  async getRevocationListVC(revocationListFullUrlPath: string) {
    try {
      const db = await getConnectedDb(this.dbConnection);

      const revocationList = await db.getRepository(RevocationList).findOne({
        where: {
          revocationListFullUrlPath,
        },
      });

      if (!revocationList) {
        throw new Error('Revocation List not found');
      }

      return JSON.parse(revocationList.verifiableCredential);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getRevocationList(revocationListFullUrlPath: string) {
    try {
      const db = await getConnectedDb(this.dbConnection);

      const revocationList = await db.getRepository(RevocationList).findOne({
        where: {
          revocationListFullUrlPath,
        },
      });

      if (!revocationList) {
        throw new Error('Revocation List not found');
      }

      return revocationList;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateRevocationListVC(args: {
    context: { agent?: IAgent };
    revocationList: RevocationList;
    index: number;
    revoked: boolean;
  }) {
    try {
      const db = await getConnectedDb(this.dbConnection);
      const vc = JSON.parse(args.revocationList.verifiableCredential);
      const revocationList2020 = await decodeList({
        encodedList: vc.credentialSubject.encodedList,
      });

      revocationList2020.setRevoked(args.index, args.revoked);

      const revocationListVc = await this.createRevocationListVC(
        vc.id,
        revocationList2020,
        vc.issuer,
        args.context
      );

      await db.getRepository(RevocationList).save({
        ...args.revocationList,
        verifiableCredential: JSON.stringify(revocationListVc),
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
