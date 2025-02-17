import {
  createCredential,
  BitstringStatusList,
  decodeList,
  VC_BSL_VC_V2_CONTEXT,
} from '@digitalbazaar/vc-bitstring-status-list';

import {
  IAgent,
  IIdentifier,
  IBitstringStatusListArgs,
  IBitstringStatusListEntry,
  ISetBitstringStatusArgs,
  W3CVerifiableCredential,
  CredentialSubject,
  UnsignedCredential,
  EnvelopedVerifiableCredential,
  VerifiableCredential,
} from '@uncefact/vckit-core-types';
import { OrPromise } from '@veramo/utils';
import {
  DataSource,
  EntityManager,
  ObjectLiteral,
  LockNotSupportedOnGivenDriverError,
} from 'typeorm';
import { BitstringStatusListEntry } from '../entities/bitstring-status-list-entry-data.js';
import { getConnectedDb } from '../utils.js';
import { decodeJWT } from 'did-jwt';

const DB_ERRORS = ['serialize', 'deadlock'];

/**
 * @public
 */
export class BitstringStatusListEntryStore {
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

  async lockBitstringStatusListEntry(
    transactionalEntityManager: EntityManager,
    query: string,
    params: ObjectLiteral,
  ) {
    try {
      await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .createQueryBuilder('bsl')
        .setLock('pessimistic_read')
        .where(query, params)
        .getExists();
    } catch (err) {
      if (err instanceof LockNotSupportedOnGivenDriverError) {
        return;
      }
      throw err;
    }
  }

  async createBitstringStatusListVC(
    bitstringStatusListUrl: string,
    statusPurpose: string,
    bitStringLength: number,
    bitstringStatusIssuer: string,
    context: { agent?: IAgent },
  ): Promise<any> {
    try {
      if (!context.agent) {
        throw Error('Agent not available');
      }
      let list = new BitstringStatusList({ length: bitStringLength });

      const credentialList = await createCredential({
        id: bitstringStatusListUrl,
        list,
        statusPurpose,
        context: VC_BSL_VC_V2_CONTEXT,
      });

      // @ts-ignore
      credentialList.issuer = bitstringStatusIssuer;

      // Issue bitstring status list VC
      const bitstringStatusList = await context.agent.execute(
        'createVerifiableCredential',
        {
          credential: credentialList,
          proofFormat: 'EnvelopingProofJose',
          fetchRemoteContexts: true,
        },
      );

      return bitstringStatusList;
    } catch (err) {
      throw err;
    }
  }

  async setBitstringStatus(
    transactionalEntityManager: EntityManager,
    args: ISetBitstringStatusArgs & {
      context: { agent?: IAgent };
    },
  ) {
    try {
      if (!args.context.agent) {
        throw Error('Agent not available');
      }
      const bitstringStatusList = await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .findOne({
          where: {
            statusListCredential: args.statusListCredential,
            statusListVCIssuer: args.statusListVCIssuer,
            statusPurpose: args.statusPurpose,
          },
        });

      if (!bitstringStatusList) {
        throw new Error('Bitstring Status List not found');
      }

      const vc: W3CVerifiableCredential | EnvelopedVerifiableCredential =
        JSON.parse(bitstringStatusList.verifiableCredential!);
      let unsignedVC: UnsignedCredential;
      let credentialSubject: CredentialSubject;
      const getUnsignedVCAndCredentialSubjectFromJWT = (vc: string) => {
        const decoded = decodeJWT(vc);
        const unsignedVC = decoded?.payload as UnsignedCredential;

        return {
          unsignedVC,
          credentialSubject:
            decoded?.payload?.vc?.credentialSubject ||
            decoded?.payload?.credentialSubject,
        };
      };

      if (typeof vc === 'string') {
        ({ unsignedVC, credentialSubject } =
          getUnsignedVCAndCredentialSubjectFromJWT(vc));
      }
      if (
        (<EnvelopedVerifiableCredential>vc).type ===
        'EnvelopedVerifiableCredential'
      ) {
        const jwt = (<EnvelopedVerifiableCredential>vc).id.split(',')[1];
        ({ unsignedVC, credentialSubject } =
          getUnsignedVCAndCredentialSubjectFromJWT(jwt));
      } else {
        credentialSubject = (<VerifiableCredential>vc).credentialSubject;
        unsignedVC = { ...(<VerifiableCredential>vc) };
        delete unsignedVC.proof;
      }

      const list = await decodeList({
        encodedList: credentialSubject.encodedList,
      });

      list.setStatus(args.index, args.status);

      credentialSubject.encodedList = await list.encode();

      const bitstringStatusListVC = await args.context.agent.execute(
        'createVerifiableCredential',
        {
          credential: unsignedVC,
          proofFormat: 'EnvelopingProofJose',
          fetchRemoteContexts: true,
        },
      );

      return await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .save({
          ...bitstringStatusList,
          verifiableCredential: JSON.stringify(bitstringStatusListVC),
        });
    } catch (err) {
      throw err;
    }
  }

  async getBitstringStatusListVC(listIndex: number) {
    try {
      const db = await getConnectedDb(this.dbConnection);

      const bitstringStatusList = await db
        .getRepository(BitstringStatusListEntry)
        .findOne({
          where: {
            listIndex,
          },
        });

      if (!bitstringStatusList) {
        throw new Error('Bitstring Status List not found');
      }

      return JSON.parse(bitstringStatusList.verifiableCredential!);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getBitstringStatusList(
    transactionalEntityManager: EntityManager,
    listIndex: number,
  ) {
    try {
      const bitstringStatusList = await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .findOne({
          where: {
            listIndex,
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

  async upsertBitstringStatusList(
    transactionalEntityManager: EntityManager,
    args: IBitstringStatusListArgs,
  ) {
    try {
      const {
        bitstringDomainURL,
        bitstringStatusIssuer,
        bitstringLength = 131072,
        statusPurpose,
        statusSize = 1,
        statusMessages = [{ status: 0 }, { status: 1 }],
        statusReference,
        context,
      } = args;

      const queryParams = {
        bitstringLength: bitstringLength,
        statusPurpose: statusPurpose.toString(),
        statusListVCIssuer: bitstringStatusIssuer,
        statusSize: statusSize,
        statusMessages: JSON.stringify(statusMessages),
      };

      this.lockBitstringStatusListEntry(
        transactionalEntityManager,
        'bsl.statusListVCIssuer = :statusListVCIssuer AND bsl.statusPurpose = :statusPurpose AND bsl.lastStatusIndex < bsl.bitstringLength AND bsl.bitstringLength = :bitstringLength AND bsl.statusSize = :statusSize AND bsl.statusMessages = :statusMessages',
        queryParams,
      );

      let bitstringStatusList: BitstringStatusListEntry | null;

      bitstringStatusList = await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .createQueryBuilder('bsl')
        .where(
          'bsl.statusListVCIssuer = :statusListVCIssuer AND bsl.statusPurpose = :statusPurpose AND bsl.lastStatusIndex < bsl.bitstringLength AND bsl.bitstringLength = :bitstringLength AND bsl.statusSize = :statusSize AND bsl.statusMessages = :statusMessages',
          queryParams,
        )
        .getOne();

      if (
        !bitstringStatusList ||
        bitstringStatusList.lastStatusIndex + bitstringStatusList.statusSize >
          bitstringLength - 1
      ) {
        bitstringStatusList = new BitstringStatusListEntry();
        bitstringStatusList.bitstringLength = bitstringLength;
        bitstringStatusList.statusListVCIssuer = bitstringStatusIssuer;
        bitstringStatusList.statusPurpose = statusPurpose;
        if (statusSize) {
          bitstringStatusList.statusSize = statusSize;
        }
        if (statusMessages) {
          bitstringStatusList.statusMessages = JSON.stringify(statusMessages);
        }
        if (statusReference) {
          bitstringStatusList.statusReference = statusReference;
        }

        bitstringStatusList = await transactionalEntityManager
          .getRepository(BitstringStatusListEntry)
          .save(bitstringStatusList);

        const statusListCredentialUrl = `${bitstringDomainURL}/credentials/status/bitstring-status-list/${bitstringStatusList.listIndex}`;
        const bitstringStatusListVC = await this.createBitstringStatusListVC(
          statusListCredentialUrl,
          bitstringStatusList.statusPurpose,
          bitstringStatusList.bitstringLength,
          bitstringStatusIssuer,
          context,
        );

        bitstringStatusList.statusListCredential = statusListCredentialUrl;
        bitstringStatusList.verifiableCredential = JSON.stringify(
          bitstringStatusListVC,
        );
      } else {
        bitstringStatusList.lastStatusIndex += bitstringStatusList.statusSize;
      }

      return await transactionalEntityManager
        .getRepository(BitstringStatusListEntry)
        .save(bitstringStatusList);
    } catch (err) {
      throw err;
    }
  }
}
