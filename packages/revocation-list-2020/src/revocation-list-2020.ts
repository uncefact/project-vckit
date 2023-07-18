import {
  IAgentPlugin,
  IRevocationListDataArgs,
  IRevocationStore,
  RequestWithAgent,
} from '@vckit/core-types';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import { RevocationDataStore } from './identifier/revocation-list-2020-store.js';
import { getConnectedDb } from './utils.js';
import {
  RevocationData,
  RevocationList,
} from './entities/revocation-list-2020-data.js';

/**
 * @public
 */
export class RevocationStatus2020 implements IAgentPlugin {
  readonly methods: IRevocationStore;
  private dbConnection: OrPromise<DataSource>;
  private store: RevocationDataStore;

  constructor(options: { dbConnection: OrPromise<DataSource> }) {
    this.store = new RevocationDataStore(options.dbConnection);
    this.dbConnection = options.dbConnection;
    this.methods = {
      getRevocationData: this.getRevocationData.bind(this),
      getRevocationListVC: this.getRevocationListVC.bind(this),
    };
  }

  async getRevocationData(
    args: IRevocationListDataArgs
  ): Promise<{ revocationListFullUrlPath: string; indexCounter: number }> {
    const data = await this.store.getRevocationData(args);

    return data;
  }

  async getRevocationListVC(
    revocationListFullUrlPath: string
  ): Promise<{ revocationList: RevocationList }> {
    const data = await this.store.getRevocationListVC(
      revocationListFullUrlPath
    );

    return data;
  }
}
