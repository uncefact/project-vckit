import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import { WebvhDidLog } from '../entities/webvh-did-log.js';

/**
 * Data access layer for did:webvh DID logs.
 *
 * All lookups support both SCID and DID string, since the DID string
 * changes on portability operations but the SCID is permanent.
 *
 * @public
 */
export class WebvhDidLogStore {
  constructor(private dbConnection: OrPromise<DataSource>) {}

  private async getDb(): Promise<DataSource> {
    const db = await this.dbConnection;
    if (!db.isInitialized) {
      await db.initialize();
    }
    return db;
  }

  /**
   * Save a new DID log entry (used on create).
   */
  async saveLog(params: {
    scid: string;
    currentDid: string;
    log: any[];
    portable: boolean;
  }): Promise<WebvhDidLog> {
    const db = await this.getDb();
    const entity = new WebvhDidLog();
    entity.scid = params.scid;
    entity.currentDid = params.currentDid;
    entity.previousDids = '[]';
    entity.log = JSON.stringify(params.log);
    entity.portable = params.portable;
    entity.deactivated = false;
    return db.getRepository(WebvhDidLog).save(entity);
  }

  /**
   * Update an existing DID log (used on update, port, deactivate).
   */
  async updateLog(params: {
    scid: string;
    currentDid?: string;
    previousDids?: string[];
    log: any[];
    deactivated?: boolean;
  }): Promise<WebvhDidLog> {
    const db = await this.getDb();
    const existing = await this.getByScid(params.scid);
    if (!existing) {
      throw new Error(`did:webvh log not found for SCID: ${params.scid}`);
    }

    existing.log = JSON.stringify(params.log);
    if (params.currentDid !== undefined) {
      existing.currentDid = params.currentDid;
    }
    if (params.previousDids !== undefined) {
      existing.previousDids = JSON.stringify(params.previousDids);
    }
    if (params.deactivated !== undefined) {
      existing.deactivated = params.deactivated;
    }
    return db.getRepository(WebvhDidLog).save(existing);
  }

  /**
   * Look up a DID log by its SCID (permanent identifier).
   */
  async getByScid(scid: string): Promise<WebvhDidLog | null> {
    const db = await this.getDb();
    return db.getRepository(WebvhDidLog).findOneBy({ scid });
  }

  /**
   * Look up a DID log by its current DID string.
   */
  async getByDid(did: string): Promise<WebvhDidLog | null> {
    const db = await this.getDb();
    // First try current DID
    const byCurrentDid = await db
      .getRepository(WebvhDidLog)
      .findOneBy({ currentDid: did });
    if (byCurrentDid) {
      return byCurrentDid;
    }

    // If not found, search in previous DIDs (for ported DIDs)
    const allLogs = await db.getRepository(WebvhDidLog).find();
    for (const log of allLogs) {
      const previousDids: string[] = JSON.parse(log.previousDids || '[]');
      if (previousDids.includes(did)) {
        return log;
      }
    }

    return null;
  }

  /**
   * Get the parsed DID log array for a given DID.
   */
  async getLogForDid(did: string): Promise<any[] | null> {
    const entity = await this.getByDid(did);
    if (!entity) return null;
    return JSON.parse(entity.log);
  }

  /**
   * Get the parsed DID log array for a given SCID.
   */
  async getLogForScid(scid: string): Promise<any[] | null> {
    const entity = await this.getByScid(scid);
    if (!entity) return null;
    return JSON.parse(entity.log);
  }

  /**
   * Delete a DID log (used on identifier deletion from Veramo store).
   */
  async deleteLog(scid: string): Promise<boolean> {
    const db = await this.getDb();
    const result = await db.getRepository(WebvhDidLog).delete({ scid });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Get all stored DID logs.
   */
  async getAllLogs(): Promise<WebvhDidLog[]> {
    const db = await this.getDb();
    return db.getRepository(WebvhDidLog).find();
  }

  /**
   * Extract the SCID from a did:webvh DID string.
   * Format: did:webvh:{SCID}:{domain}:{path...}
   */
  static extractScid(did: string): string {
    const parts = did.split(':');
    if (parts.length < 4 || parts[0] !== 'did' || parts[1] !== 'webvh') {
      throw new Error(`Invalid did:webvh DID: ${did}`);
    }
    return parts[2];
  }
}
