import { createCredential, createList } from '@transmute/vc-status-rl-2020';
import { IRevocationListDataArgs } from '@vckit/core-types';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import {
  RevocationData,
  RevocationList,
} from '../entities/revocation-list-2020-data.js';
import { RequestWithAgent } from '../revocation-list-2020-router.js';
import { getConnectedDb } from '../utils.js';

/**
 * @public
 */
export class RevocationDataStore {
  constructor(private dbConnection: OrPromise<DataSource>) {}

  async createRevocationListVC(
    revocationListFullUrlPath: string,
    bitStringLength: number,
    revocationVCIssuer: string,
    req: RequestWithAgent
  ): Promise<any> {
    try {
      if (!req.agent) {
        throw Error('Agent not available');
      }

      const list = await createList({ length: bitStringLength });
      const credentialList = await createCredential({
        id: revocationListFullUrlPath,
        list,
      });

      // @ts-ignore
      credentialList.issuer = revocationVCIssuer;

      const { credential, ...rest } = req.body;

      // Issue RevocationList VC
      const revocationList = await req.agent.execute(
        'createVerifiableCredential',
        {
          credential: credentialList,
          ...rest,
        }
      );

      return revocationList;
    } catch (err) {
      throw err;
    }
  }

  async getRevocationData(
    args: IRevocationListDataArgs
  ): Promise<{ revocationListFullUrlPath: string; indexCounter: number }> {
    try {
      const {
        revocationListPath: revocationListUrlPath,
        revocationVCIssuer,
        bitStringLength,
        req,
      } = args;
      const db = await getConnectedDb(this.dbConnection);

      let revocationData = await db
        .getRepository(RevocationData)
        .findOne({ where: { revocationListUrlPath } });

      if (!revocationData) {
        revocationData = await db.getRepository(RevocationData).save({
          revocationListUrlPath,
          bitStringLength: Number(bitStringLength),
        });
      }

      const revocationListFullUrlPath = `/credentials/status/revocation-list-2020/${revocationData.listCounter}`;

      let revocationList = await db.getRepository(RevocationList).findOne({
        where: {
          revocationListFullUrlPath,
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
          verifiableCredential: JSON.stringify(revocationList),
        });
      }

      await this.updateRevocationData({
        revocationData,
        args,
      });

      return {
        revocationListFullUrlPath,
        indexCounter: revocationData.indexCounter,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateRevocationData({
    revocationData,
    args,
  }: {
    revocationData: RevocationData;
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

        const revocationListFullUrlPath = `/credentials/status/revocation-list-2020/${nextList}`;

        const revocationList = await this.createRevocationListVC(
          `${args.revocationListPath}${revocationListFullUrlPath}`,
          Number(args.bitStringLength),
          args.revocationVCIssuer,
          args.req
        );

        await db.getRepository(RevocationList).save({
          revocationListFullUrlPath,
          verifiableCredential: JSON.stringify(revocationList),
        });
      }

      const d = await db.getRepository(RevocationData).save({
        revocationListUrlPath: revocationData.revocationListUrlPath,
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
}
