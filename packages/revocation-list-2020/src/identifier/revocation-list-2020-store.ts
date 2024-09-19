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
import {
  DataSource,
  EntityManager,
  ObjectLiteral,
  LockNotSupportedOnGivenDriverError,
} from 'typeorm';
import {
  RevocationData,
  RevocationList,
} from '../entities/revocation-list-2020-data.js';
import { getConnectedDb } from '../utils.js';

const DB_ERRORS = ['serialize', 'deadlock'];

/**
 * @public
 */
export class RevocationDataStore {
  constructor(private dbConnection: OrPromise<DataSource>) {}

  async runTransactionWithExponentialBackoff(
    transactionCallback: (
      transactionalEntityManager: EntityManager
    ) => Promise<void>,
    maxRetries = 5,
    baseDelay = 1000
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
            error.message.includes(dbError)
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
    callback: (transactionalEntityManager: EntityManager) => Promise<void>
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

  async lockRevocationData(
    transactionalEntityManager: EntityManager,
    query: ObjectLiteral
  ) {
    try {
      await transactionalEntityManager
        .getRepository(RevocationData)
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

  async lockRevocationList(
    transactionalEntityManager: EntityManager,
    query: ObjectLiteral
  ) {
    try {
      await transactionalEntityManager
        .getRepository(RevocationList)
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

  async issueRevocationData(
    transactionalEntityManager: EntityManager,
    args: IRevocationListDataArgs
  ): Promise<{ revocationListFullUrl: string; indexCounter: number }> {
    try {
      let revocationData: RevocationData | null;
      const {
        revocationListPath: revocationListUrlPath,
        revocationVCIssuer,
        bitStringLength,
        req,
      } = args;
      if (!revocationListUrlPath) {
        throw new Error('Revocation List Path not provided');
      }

      if (!bitStringLength) {
        throw new Error('Bit String Length not provided');
      }

      let revocationListFullUrlPath: string;

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

      revocationData = await this.upsertRevocationData(
        transactionalEntityManager,
        {
          revocationListUrlPath,
          revocationVCIdentifierDid: revocationVCIdentifier.did,
          bitStringLength: Number(bitStringLength),
        }
      );

      revocationListFullUrlPath = `/credentials/status/revocation-list-2020/${revocationVCIssuerDid}/${revocationData.listCounter}`;

      await this.upsertRevocationList(transactionalEntityManager, {
        revocationListFullUrlPath,
        revocationVCIdentifierDid: revocationVCIdentifier.did,
        revocationVCIssuer,
        bitStringLength: Number(bitStringLength),
        revocationListUrlPath,
        req,
      });

      return {
        revocationListFullUrl: `${revocationListUrlPath}${revocationListFullUrlPath!}`,
        indexCounter: revocationData!.indexCounter,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateRevocationData(
    transactionalEntityManager: EntityManager,
    {
      revocationData,
      revocationVCIssuerDid,
      args,
    }: {
      revocationData: RevocationData;
      revocationVCIssuerDid: string;
      args: IRevocationListDataArgs;
    }
  ): Promise<void> {
    try {
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

        await this.lockRevocationList(transactionalEntityManager, {
          revocationListFullUrlPath,
          revocationVCIssuer: args.revocationVCIssuer,
        });

        const revocationList = await this.createRevocationListVC(
          `${args.revocationListPath}${revocationListFullUrlPath}`,
          Number(args.bitStringLength),
          args.revocationVCIssuer,
          args.req
        );

        await transactionalEntityManager.getRepository(RevocationList).save({
          revocationListFullUrlPath,
          revocationVCIssuer: args.revocationVCIssuer,
          verifiableCredential: JSON.stringify(revocationList),
        });
      }

      await transactionalEntityManager.getRepository(RevocationData).save({
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

  async getRevocationList(
    transactionalEntityManager: EntityManager,
    revocationListFullUrlPath: string
  ) {
    try {
      const revocationList = await transactionalEntityManager
        .getRepository(RevocationList)
        .findOne({
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

  async upsertRevocationData(
    transactionalEntityManager: EntityManager,
    args: {
      revocationListUrlPath: string;
      revocationVCIdentifierDid: string;
      bitStringLength: number;
    }
  ) {
    const {
      revocationListUrlPath,
      revocationVCIdentifierDid,
      bitStringLength,
    } = args;

    await this.lockRevocationData(transactionalEntityManager, {
      revocationListUrlPath,
      revocationVCIssuer: revocationVCIdentifierDid,
    });

    let revocationData: RevocationData | null = await transactionalEntityManager
      .getRepository(RevocationData)
      .findOne({
        where: {
          revocationListUrlPath,
          revocationVCIssuer: revocationVCIdentifierDid,
        },
      });

    if (!revocationData) {
      revocationData = new RevocationData();
      revocationData.revocationListUrlPath = revocationListUrlPath!;
      revocationData.revocationVCIssuer = revocationVCIdentifierDid;
      revocationData.bitStringLength = bitStringLength;
    } else {
      let nextIndex = revocationData.indexCounter + 1;
      let nextList = revocationData.listCounter;
      if (
        args.bitStringLength != revocationData.bitStringLength ||
        nextIndex >= revocationData.bitStringLength
      ) {
        nextList += 1;
        nextIndex = 0;

        if (args.bitStringLength != revocationData.bitStringLength) {
          revocationData.bitStringLength = args.bitStringLength;
        }
      }
      revocationData.indexCounter = nextIndex;
      revocationData.listCounter = nextList;
    }

    return await transactionalEntityManager
      .getRepository(RevocationData)
      .save(revocationData);
  }

  async upsertRevocationList(
    transactionalEntityManager: EntityManager,
    args: {
      revocationListFullUrlPath: string;
      revocationVCIdentifierDid: string;
      revocationVCIssuer: string;
      bitStringLength: number;
      revocationListUrlPath: string;
      req: any;
    }
  ) {
    try {
      const {
        revocationListFullUrlPath,
        revocationVCIdentifierDid,
        revocationVCIssuer,
        bitStringLength,
        revocationListUrlPath,
        req,
      } = args;

      await this.lockRevocationList(transactionalEntityManager, {
        revocationListFullUrlPath,
        revocationVCIssuer: revocationVCIdentifierDid,
      });

      let revocationList = await transactionalEntityManager
        .getRepository(RevocationList)
        .findOne({
          where: {
            revocationListFullUrlPath,
            revocationVCIssuer: revocationVCIdentifierDid,
          },
        });

      if (
        !revocationList ||
        revocationList.revocationListFullUrlPath !== revocationListFullUrlPath
      ) {
        const revocationListVC = await this.createRevocationListVC(
          `${revocationListUrlPath}${revocationListFullUrlPath}`,
          bitStringLength,
          revocationVCIssuer,
          req
        );

        revocationList = new RevocationList();
        revocationList.revocationListFullUrlPath = revocationListFullUrlPath;
        revocationList.revocationVCIssuer = revocationVCIdentifierDid;
        revocationList.verifiableCredential = JSON.stringify(revocationListVC);
      }

      return await transactionalEntityManager
        .getRepository(RevocationList)
        .save(revocationList);
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateRevocationListVC(
    transactionalEntityManager: EntityManager,
    args: {
      context: { agent?: IAgent };
      revocationList: RevocationList;
      index: number;
      revoked: boolean;
    }
  ) {
    try {
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

      await transactionalEntityManager.getRepository(RevocationList).save({
        ...args.revocationList,
        verifiableCredential: JSON.stringify(revocationListVc),
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
