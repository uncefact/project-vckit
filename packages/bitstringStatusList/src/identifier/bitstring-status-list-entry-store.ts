// import {
//   RevocationList2020,
//   createCredential,
//   createList,
//   decodeList,
// } from '@digitalbazaar/vc-bitstring-status-list';

import {
  IAgent,
  IIdentifier,
  IBitstringStatusListDataArgs,
} from '@vckit/core-types';
import { OrPromise } from '@veramo/utils';
import {
  DataSource,
  EntityManager,
  ObjectLiteral,
  LockNotSupportedOnGivenDriverError,
} from 'typeorm';
import {
  BitstringStatusData,
  BitstringStatusListEntry,
} from '../entities/bitstring-status-list-entry-data';
import { getConnectedDb } from '../utils.js';

const DB_ERRORS = ['serialize', 'deadlock'];

/**
 * @public
 */
export class BitstringStatusListDataStore {
  constructor(private dbConnection: OrPromise<DataSource>) {}

  async runTransactionWithExponentialBackoff(
    transactionCallback: (
      transactionalEntityManager: EntityManager,
    ) => Promise<void>,
    maxRetries = 5,
    baseDelay = 1000,
  ) {
    let isDone = false;
    let retries = 0;
    let delay = baseDelay;
    const db = await getConnectedDb(this.dbConnection);
    const manager = db.manager;

    while (retries < maxRetries) {
      await manager.transaction(async (transactionalEntityManager) => {
        try {
          await transactionCallback(transactionalEntityManager);
          isDone = true;
        } catch (error) {
          const canRetry = DB_ERRORS.some((dbError) =>
            error.message.includes(dbError),
          );

          if (canRetry && retries < maxRetries) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff: double the delay
          } else {
            throw error; // Rethrow the error if it's not a serialization error or max retries exceeded
          }
        }
      });

      if (isDone) {
        return;
      }
    }
  }

  async transaction(
    callback: (transactionalEntityManager: EntityManager) => Promise<void>,
  ) {
    const db = await getConnectedDb(this.dbConnection);
    try {
      await db.manager.transaction(async (transactionalEntityManager) => {
        await callback(transactionalEntityManager);
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async lockBitstringStatusData(
    transactionalEntityManager: EntityManager,
    query: ObjectLiteral,
  ) {
    try {
      await transactionalEntityManager
        .getRepository(BitstringStatusData)
        .createQueryBuilder()
        .setLock('pessimistic_read')
        .where(query)
        .getExists();
    } catch (err) {
      if (err instanceof LockNotSupportedOnGivenDriverError) {
        return;
      }
      throw err;
    }
  }

  async lockBitstringStatusListEntry(
    transactionalEntityManager: EntityManager,
    query: ObjectLiteral,
  ) {
    try {
      await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .createQueryBuilder()
        .setLock('pessimistic_read')
        .where(query)
        .getExists();
    } catch (err) {
      if (err instanceof LockNotSupportedOnGivenDriverError) {
        return;
      }
      throw err;
    }
  }

  async createBitstringStatusListVC(
    bitstringStatusListFullUrlPath: string,
    bitStringLengthOrList: number,
    bitstringStatusVCIssuer: string,
    context: { agent?: IAgent },
  ): Promise<any> {
    try {
      if (!context.agent) {
        throw Error('Agent not available');
      }
      let list;
      if (typeof bitStringLengthOrList === 'number') {
        list = await createList({ length: bitStringLengthOrList });
      } else {
        list = bitStringLengthOrList;
      }

      const credentialList = await createCredential({
        id: bitstringStatusListFullUrlPath,
        list,
      });

      // @ts-ignore
      credentialList.issuer = bitstringStatusVCIssuer;

      // Issue RevocationList VC
      const bitstringStatusList = await context.agent.execute(
        'createVerifiableCredential',
        {
          credential: credentialList,
          proofFormat: 'lds',
          fetchRemoteContexts: true,
        },
      );

      return bitstringStatusList;
    } catch (err) {
      throw err;
    }
  }

  async issueBitstringStatusData(
    transactionalEntityManager: EntityManager,
    args: IBitstringStatusListDataArgs,
  ): Promise<{ bitstringStatusListFullUrl: string; indexCounter: number }> {
    try {
      let bitstringStatusData: BitstringStatusData;
      const {
        bitstringStatusListPath: bitstringStatusListUrlPath,
        bitstringStatusListVCIssuer,
        bitstringLength,
        req,
      } = args;
      if (!bitstringStatusListUrlPath) {
        throw new Error('Bitstring Status List Path not provided');
      }

      if (!bitstringLength) {
        throw new Error('Bitstring Length not provided');
      }

      let bitstringStatusListFullUrlPath: string;

      let bitstringStatusVCIdentifier: IIdentifier;
      try {
        bitstringStatusVCIdentifier = (await req.agent?.execute(
          'didManagerGet',
          {
            did: bitstringStatusListVCIssuer,
          },
        )) as IIdentifier;
      } catch (e) {
        throw new Error(
          `invalid_argument: credential.issuer must be a DID managed by this agent.`,
        );
      }
      const bitstringStatusVCIssuerDid =
        bitstringStatusVCIdentifier.did.replaceAll(':', '_');

      bitstringStatusData = await this.upsertBitstringStatusData(
        transactionalEntityManager,
        {
          bitstringStatusListUrlPath,
          bitstringStatusVCIdentifier: bitstringStatusVCIdentifier.did,
          bitStringLength: Number(bitstringLength),
        },
      );

      bitstringStatusListFullUrlPath = `/credentials/status/bitstring-status-list-entry/${bitstringStatusVCIssuerDid}/${bitstringStatusData.listCounter}`;

      await this.upsertBitstringStatusList(transactionalEntityManager, {
        bitstringStatusListFullUrlPath,
        bitstringStatusVCIdentifierDid: bitstringStatusVCIdentifier.did,
        bitstringStatusListVCIssuer,
        bitstringLength: Number(bitstringLength),
        bitstringStatusListUrlPath,
        req,
      });

      return {
        bitstringStatusListFullUrl: `${bitstringStatusListUrlPath}${bitstringStatusListFullUrlPath!}`,
        indexCounter: bitstringStatusData!.indexCounter,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateBitstringStatusData(
    transactionalEntityManager: EntityManager,
    {
      bitstringStatusData,
      bitstringStatusVCIssuerDid,
      args,
    }: {
      bitstringStatusData: BitstringStatusData;
      bitstringStatusVCIssuerDid: string;
      args: IBitstringStatusListDataArgs;
    },
  ): Promise<void> {
    try {
      let nextIndex = bitstringStatusData.indexCounter + 1;
      let nextList = bitstringStatusData.listCounter;
      let nextBitStringLength = bitstringStatusData.bitstringLength;

      // Check if we need to update the bit string length
      if (
        Number(args.bitStringLength) != bitstringStatusData.bitstringLength ||
        nextIndex >= bitstringStatusData.bitstringLength
      ) {
        nextList += 1;
        nextIndex = 0;

        if (
          Number(args.bitStringLength) != bitstringStatusData.bitstringLength
        ) {
          nextBitStringLength = Number(args.bitStringLength);
        }

        const bitstringStatusListFullUrlPath = `/credentials/status/bitstring-status-list-entry/${bitstringStatusVCIssuerDid}/${nextList}`;

        await this.lockBitstringStatusData(transactionalEntityManager, {
          bitstringStatusListFullUrlPath,
          bitstringStatusVCIssuer: args.bitstringStatusListVCIssuer,
        });

        const bitstringStatusList = await this.createBitstringStatusListVC(
          `${args.bitstringStatusListPath}${bitstringStatusListFullUrlPath}`,
          Number(args.bitStringLength),
          args.bitstringStatusListVCIssuer,
          args.req,
        );

        await transactionalEntityManager
          .getRepository(BitstringStatusListEntry)
          .save({
            bitstringStatusListFullUrlPath,
            bitstringStatusListVCIssuer: args.bitstringStatusListVCIssuer,
            verifiableCredential: JSON.stringify(bitstringStatusList),
          });
      }

      await transactionalEntityManager.getRepository(BitstringStatusData).save({
        ...bitstringStatusData,
        bitstringStatusListUrlPath:
          bitstringStatusData.bitstringStatusListUrlPath,
        bitstringStatusListVCIssuer: args.bitstringStatusListVCIssuer,
        indexCounter: nextIndex,
        listCounter: nextList,
        bitStringLength: nextBitStringLength,
      });
    } catch (err) {
      // Handle Errors here
      throw new Error(err);
    }
  }

  async getBitstringStatusListVC(bitstringStatusListFullUrlPath: string) {
    try {
      const db = await getConnectedDb(this.dbConnection);

      const bitstringStatusList = await db
        .getRepository(BitstringStatusListEntry)
        .findOne({
          where: {
            bitstringStatusListFullUrlPath,
          },
        });

      if (!bitstringStatusList) {
        throw new Error('Bitstring Status List not found');
      }

      return JSON.parse(bitstringStatusList.verifiableCredential);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getBitstringStatusList(
    transactionalEntityManager: EntityManager,
    bitstringStatusListFullUrlPath: string,
  ) {
    try {
      const bitstringStatusList = await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .findOne({
          where: {
            bitstringStatusListFullUrlPath,
          },
        });

      if (!bitstringStatusList) {
        throw new Error('Bitstring Status List not found');
      }

      return bitstringStatusList;
    } catch (err) {
      throw new Error(err);
    }
  }

  async upsertBitstringStatusData(
    transactionalEntityManager: EntityManager,
    args: {
      bitstringStatusListUrlPath: string;
      bitstringStatusVCIdentifier: string;
      bitStringLength: number;
    },
  ) {
    const {
      bitstringStatusListUrlPath,
      bitstringStatusVCIdentifier,
      bitStringLength,
    } = args;

    await this.lockBitstringStatusData(transactionalEntityManager, {
      bitstringStatusListUrlPath,
      bitstringStatusVCIdentifier,
    });

    let bitstringStatusData: BitstringStatusData | null =
      await transactionalEntityManager
        .getRepository(BitstringStatusData)
        .findOne({
          where: {
            bitstringStatusListUrlPath,
            bitstringStatusListVCIssuer: bitstringStatusVCIdentifier,
          },
        });

    if (!bitstringStatusData) {
      bitstringStatusData = new BitstringStatusData();
      bitstringStatusData.bitstringStatusListUrlPath =
        bitstringStatusListUrlPath!;
      bitstringStatusData.bitstringStatusListVCIssuer =
        bitstringStatusVCIdentifier;
      bitstringStatusData.bitstringLength = bitStringLength;
    } else {
      let nextIndex = bitstringStatusData.indexCounter + 1;
      let nextList = bitstringStatusData.listCounter;
      if (
        args.bitStringLength != bitstringStatusData.bitstringLength ||
        nextIndex >= bitstringStatusData.bitstringLength
      ) {
        nextList += 1;
        nextIndex = 0;

        if (args.bitStringLength != bitstringStatusData.bitstringLength) {
          bitstringStatusData.bitstringLength = args.bitStringLength;
        }
      }
      bitstringStatusData.indexCounter = nextIndex;
      bitstringStatusData.listCounter = nextList;
    }

    return await transactionalEntityManager
      .getRepository(BitstringStatusData)
      .save(bitstringStatusData);
  }

  async upsertBitstringStatusList(
    transactionalEntityManager: EntityManager,
    args: {
      bitstringStatusListFullUrlPath: string;
      bitstringStatusVCIdentifierDid: string;
      bitstringStatusListVCIssuer: string;
      bitstringLength: number;
      bitstringStatusListUrlPath: string;
      req: any;
    },
  ) {
    try {
      const {
        bitstringStatusListFullUrlPath,
        bitstringStatusVCIdentifierDid,
        bitstringStatusListVCIssuer,
        bitstringLength,
        bitstringStatusListUrlPath,
        req,
      } = args;

      await this.lockBitstringStatusData(transactionalEntityManager, {
        bitstringStatusListFullUrlPath,
        bitstringStatusListVCIssuer: bitstringStatusVCIdentifierDid,
      });

      let bitstringStatusList = await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .findOne({
          where: {
            bitstringStatusListFullUrlPath,
            bitstringStatusListVCIssuer: bitstringStatusVCIdentifierDid,
          },
        });

      if (
        !bitstringStatusList ||
        bitstringStatusList.bitstringStatusListFullUrlPath !==
          bitstringStatusListFullUrlPath
      ) {
        const BitstringStatusListVC = await this.createBitstringStatusListVC(
          `${bitstringStatusListUrlPath}${bitstringStatusListFullUrlPath}`,
          bitstringLength,
          bitstringStatusListVCIssuer,
          req,
        );

        bitstringStatusList = new BitstringStatusListEntry();
        bitstringStatusList.bitstringStatusListFullUrlPath =
          bitstringStatusListFullUrlPath;
        bitstringStatusList.bitstringStatusListVCIssuer =
          bitstringStatusVCIdentifierDid;
        bitstringStatusList.verifiableCredential = JSON.stringify(
          BitstringStatusListVC,
        );
      }

      return await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .save(bitstringStatusList);
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateBitstringStatusListVC(
    transactionalEntityManager: EntityManager,
    args: {
      context: { agent?: IAgent };
      bitstringStatusList: BitstringStatusListEntry;
      index: number;
      revoked: boolean;
    },
  ) {
    try {
      const vc = JSON.parse(args.bitstringStatusList.verifiableCredential);
      const bitstringStatusList = await decodeList({
        encodedList: vc.credentialSubject.encodedList,
      });

      bitstringStatusList.setRevoked(args.index, args.revoked);

      const bitstringStatusVc = await this.createBitstringStatusListVC(
        vc.id,
        bitstringStatusList,
        vc.issuer,
        args.context,
      );

      await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .save({
          ...args.bitstringStatusList,
          verifiableCredential: JSON.stringify(bitstringStatusVc),
        });
    } catch (err) {
      throw new Error(err);
    }
  }
}
