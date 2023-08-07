import {
  CredentialStatus,
  IAgent,
  IAgentPlugin,
  IRevocationListDataArgs,
  IRevocationList2020,
  VerifiableCredential,
  IDataStore,
  IHashCredentialArgs,
} from '@vckit/core-types';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import { RevocationDataStore } from './identifier/revocation-list-2020-store.js';
import { RevocationList } from './entities/revocation-list-2020-data.js';
import { checkStatus as _checkStatus } from './revocation-list-2020-status.js';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

/**
 * @public
 */
export class RevocationStatus2020 implements IAgentPlugin {
  readonly methods: IRevocationList2020;
  readonly schema = schema.IRevocationList2020;
  private dbConnection: OrPromise<DataSource>;
  private store: RevocationDataStore;
  private revocationListPath: string;
  private bitStringLength: string;

  constructor(options: {
    dbConnection: OrPromise<DataSource>;
    revocationListPath: string;
    bitStringLength: string;
  }) {
    this.store = new RevocationDataStore(options.dbConnection);
    this.revocationListPath = options.revocationListPath;
    this.bitStringLength = options.bitStringLength;

    this.dbConnection = options.dbConnection;
    this.methods = {
      getRevocationData: this.getRevocationData.bind(this),
      getRevocationListVC: this.getRevocationListVC.bind(this),
      checkStatus: this.checkStatus.bind(this),
      revokeCredential: this.revokeCredential.bind(this),
      activateCredential: this.activateCredential.bind(this),
    };
  }

  async getRevocationData(
    args: IRevocationListDataArgs
  ): Promise<{ revocationListFullUrl: string; indexCounter: number }> {
    try {
      args.revocationListPath = this.revocationListPath;
      args.bitStringLength = this.bitStringLength;

      const data = await this.store.getRevocationData(args);

      return data;
    } catch (err) {
      throw err;
    }
  }

  async getRevocationListVC(
    revocationListFullUrlPath: string
  ): Promise<{ revocationList: RevocationList }> {
    const data = await this.store.getRevocationListVC(
      revocationListFullUrlPath
    );

    return data;
  }

  async checkStatus(
    args: IHashCredentialArgs,
    context: {
      agent?: IAgent;
    }
  ): Promise<CredentialStatus> {
    try {
      const credential = await context.agent?.execute(
        'dataStoreGetVerifiableCredential',
        { hash: args.hash }
      );

      if (!credential) {
        throw new Error('Credential not found');
      }
      const status = await _checkStatus(credential);
      return status;
    } catch (err) {
      throw err;
    }
  }

  async revokeCredential(
    args: IHashCredentialArgs,
    context: {
      agent?: IAgent;
    }
  ): Promise<CredentialStatus> {
    const credential = await context.agent?.execute(
      'dataStoreGetVerifiableCredential',
      { hash: args.hash }
    );

    if (!credential) {
      throw new Error('Credential not found');
    }

    const credentialStatus = await _checkStatus(credential);
    if (credentialStatus.revoked === true) {
      throw new Error('Credential already revoked.');
    }

    const revocationListFullUrlPath = (
      credential.credentialStatus?.id as string
    ).split(this.revocationListPath)[1];
    if (!revocationListFullUrlPath) {
      throw new Error('Revocation list not found');
    }

    const revocationList = await this.store.getRevocationList(
      revocationListFullUrlPath
    );

    await this.store.updateRevocationListVC({
      context: context,
      revocationList,
      index: credential.credentialStatus?.revocationListIndex,
      revoked: true,
    });

    const status: CredentialStatus = {
      revoked: true,
    };

    return status;
  }

  async activateCredential(
    args: IHashCredentialArgs,
    context: {
      agent?: IAgent;
    }
  ): Promise<CredentialStatus> {
    const credential = await context.agent?.execute(
      'dataStoreGetVerifiableCredential',
      { hash: args.hash }
    );

    if (!credential) {
      throw new Error('Credential not found');
    }

    const credentialStatus = await _checkStatus(credential);
    if (credentialStatus.revoked === false) {
      throw new Error('Credential already active.');
    }

    const revocationListFullUrlPath = (
      credential.credentialStatus?.id as string
    ).split(this.revocationListPath)[1];
    if (!revocationListFullUrlPath) {
      throw new Error('Revocation list not found');
    }

    const revocationList = await this.store.getRevocationList(
      revocationListFullUrlPath
    );

    await this.store.updateRevocationListVC({
      context: context,
      revocationList,
      index: credential.credentialStatus?.revocationListIndex,
      revoked: false,
    });

    const status: CredentialStatus = {
      revoked: false,
    };

    return status;
  }
}
