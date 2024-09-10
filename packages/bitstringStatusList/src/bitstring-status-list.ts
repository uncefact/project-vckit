import {
  IAgentPlugin,
  IBitstringStatusList,
  IBitstringStatusListArgs,
  ICheckBitstringStatusArgs,
  IIdentifier,
  IIssueBitstringStatusListArgs,
  ISetBitstringStatusArgs,
  IVerifiableCredentialJSONOrJWT,
} from '@vckit/core-types';
import { BitstringStatusListEntryStore } from './identifier/bitstring-status-list-entry-store.js';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };
import { checkStatus } from './bitstring-status-list-status.js';

export class BitstringStatusList implements IAgentPlugin {
  readonly methods: IBitstringStatusList;
  readonly schema = schema.IBitstringStatusList;
  private store: BitstringStatusListEntryStore;
  private bitstringDomainURL: string;

  constructor(options: {
    dbConnection: OrPromise<DataSource>;
    bitstringDomainURL: string;
  }) {
    this.store = new BitstringStatusListEntryStore(options.dbConnection);
    this.bitstringDomainURL = options.bitstringDomainURL;
    this.methods = {
      issueBitstringStatusList: this.issueBitstringStatusList.bind(this),
      checkBitstringStatus: this.checkBitstringStatus.bind(this),
      setBitstringStatus: this.setBitstringStatus.bind(this),
      getBitstringStatusListVC: this.getBitstringStatusListVC.bind(this),
    };
  }

  async issueBitstringStatusList(
    args: IIssueBitstringStatusListArgs,
    context: { agent?: any },
  ) {
    try {
      let vcIdentifier: IIdentifier;
      try {
        vcIdentifier = (await context.agent?.execute('didManagerGet', {
          did: args.bitstringStatusIssuer,
        })) as IIdentifier;
      } catch (e) {
        console.error(e);
        throw new Error(
          `invalid_argument: credential.issuer must be a DID managed by this agent.`,
        );
      }

      let bitstringStatus;
      await this.store.runTransactionWithExponentialBackoff(
        async (transactionalEntityManager) => {
          const params = {
            ...args,
            bitstringDomainURL: this.bitstringDomainURL,
            context: context,
            bitstringStatusIssuer: vcIdentifier.did,
          } as any;

          const bitstringStatusList =
            await this.store.upsertBitstringStatusList(
              transactionalEntityManager,
              params,
            );

          bitstringStatus = {
            id: `${bitstringStatusList.statusListCredential}#${bitstringStatusList.lastStatusIndex}`,
            type: 'BitstringStatusListEntry',
            statusPurpose: args.statusPurpose,
            statusListIndex: bitstringStatusList.lastStatusIndex,
            statusListCredential: bitstringStatusList.statusListCredential!,
          };
        },
      );

      return bitstringStatus;
    } catch (err) {
      throw err;
    }
  }

  async checkBitstringStatus(
    args: ICheckBitstringStatusArgs,
    context: { agent?: any },
  ): Promise<any> {
    try {
      return checkStatus(args.verifiableCredential);
    } catch (err) {
      throw err;
    }
  }

  async setBitstringStatus(
    args: ISetBitstringStatusArgs,
    context: { agent?: any },
  ): Promise<any> {
    try {
      await this.store.runTransactionWithExponentialBackoff(
        async (transactionalEntityManager) => {
          await this.store.setBitstringStatus(transactionalEntityManager, {
            ...args,
            context: context,
          });
        },
      );

      return { status: args.status };
    } catch (err) {
      throw err;
    }
  }

  async getBitstringStatusListVC(id: number): Promise<any> {
    try {
      const result = await this.store.getBitstringStatusListVC(id);
      return result;
    } catch (e: any) {
      throw e;
    }
  }
}
