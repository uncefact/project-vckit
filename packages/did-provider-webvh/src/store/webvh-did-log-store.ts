import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import { Identifier, Key, Service } from '@veramo/data-store';
import type { DIDLog, WitnessProofFileEntry } from 'didwebvh-ts';
import { WebvhWitnessProof } from '../entities/webvh-witness-proof.js';

// A single-connection driver must not admit another operation into an active transaction.
const queues = new WeakMap<DataSource, Promise<unknown>>();
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

  private async withDb<T>(operation: (db: DataSource) => Promise<T>): Promise<T> {
    const db = await this.getDb();
    const previous = queues.get(db) ?? Promise.resolve();
    const next = previous.catch(() => undefined).then(() => operation(db));
    queues.set(db, next.catch(() => undefined));
    return next;
  }

  /**
   * Save a new DID log entry (used on create).
   */
  async saveLog(params: {
    scid: string;
    currentDid: string;
    log: any[];
    portable: boolean;
    updateKeyRefs?: Record<string, string>;
  }): Promise<WebvhDidLog> {
    return this.withDb(async db => {
    const entity = new WebvhDidLog();
    entity.scid = params.scid;
    entity.currentDid = params.currentDid;
    entity.previousDids = '[]';
    entity.log = JSON.stringify(params.log);
    entity.portable = params.portable;
    entity.deactivated = false;
    entity.updateKeyRefs = JSON.stringify(params.updateKeyRefs || {});
    await db.getRepository(WebvhDidLog).insert(entity);
    return entity;
    });
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
    /** Move managed identifier relations in the same transaction as the history. */
    port?: { fromDid: string; toDid: string; controllerKeyId: string };
    updateKeyRefs?: Record<string, string>;
  }): Promise<WebvhDidLog> {
    return this.withDb(async db => db.transaction(async manager => {
    const existing = await manager.getRepository(WebvhDidLog).findOneBy({ scid: params.scid });
    if (!existing) {
      throw new Error(`did:webvh log not found for SCID: ${params.scid}`);
    }

    // The candidate must extend precisely the history the caller read. Never
    // overwrite an accepted entry, including when another writer wins a race.
    const predecessor = JSON.stringify(params.log.slice(0, -1));
    if (!params.log.length || predecessor !== existing.log) {
      throw new Error('WebVH update conflict: reload the DID history and retry');
    }
    const changes = {
      log: JSON.stringify(params.log),
      updatedAt: new Date(),
      ...(params.updateKeyRefs ? { updateKeyRefs: JSON.stringify(params.updateKeyRefs) } : {}),
      ...(params.currentDid !== undefined ? { currentDid: params.currentDid } : {}),
      ...(params.previousDids !== undefined ? { previousDids: JSON.stringify(params.previousDids) } : {}),
      ...(params.deactivated !== undefined ? { deactivated: params.deactivated } : {}),
    };
    const result = await manager.getRepository(WebvhDidLog).createQueryBuilder()
      .update().set(changes)
      .where({ scid: params.scid, log: predecessor })
      .execute();
    if (result.affected !== 1) {
      throw new Error('WebVH update conflict: reload the DID history and retry');
    }
    if (params.port) {
      const { fromDid, toDid, controllerKeyId } = params.port;
      if (!db.hasMetadata(Identifier)) throw new Error('Portability requires WebVH and Veramo DIDStore to share a DataSource');
      const identifiers = manager.getRepository(Identifier);
      const old = await identifiers.findOneBy({ did: fromDid });
      if (!old?.provider) throw new Error('Managed source identifier not found in the shared DataSource');
      // Retain the historical DID and its credential/message relations. Release only
      // its managed alias and move the managed key/service relations to the new DID.
      await identifiers.update({ did: fromDid }, { alias: null as any, provider: null as any, controllerKeyId: null as any });
      const next = identifiers.create({ did: toDid, alias: old.alias, provider: old.provider, controllerKeyId });
      await identifiers.insert(next);
      await manager.getRepository(Key).update({ identifier: { did: fromDid } }, { identifier: { did: toDid } });
      await manager.getRepository(Service).update({ identifier: { did: fromDid } }, { identifier: { did: toDid } });
    }
    return Object.assign(existing, changes);
    }));
  }

  /**
   * Publish verified approvals before appending their candidate log entry.
   * Keep approvals for published entries: a pending proof cannot replace them.
   */
  async stageWitnessProofs(params: {
    scid: string;
    dids: string[];
    expectedLog: DIDLog;
    proofs: WitnessProofFileEntry[];
  }): Promise<void> {
    return this.withDb(db => db.transaction(async manager => {
      const log = await manager.getRepository(WebvhDidLog).findOneBy({ scid: params.scid });
      if ((log?.log ?? '[]') !== JSON.stringify(params.expectedLog)) {
        throw new Error('WebVH update conflict: reload the DID history and retry');
      }
      const repository = manager.getRepository(WebvhWitnessProof);
      const existing = await repository.findOneBy({ scid: params.scid });
      const proofSets: WitnessProofFileEntry[] = JSON.parse(existing?.proofs ?? '[]');
      for (const incoming of params.proofs) {
        let target = proofSets.find(entry => entry.versionId === incoming.versionId);
        if (!target) {
          target = { versionId: incoming.versionId, proof: [] };
          proofSets.push(target);
        }
        for (const proof of incoming.proof) {
          if (!target.proof.some(previous => JSON.stringify(previous) === JSON.stringify(proof))) target.proof.push(proof);
        }
      }
      await repository.save(repository.create({
        scid: params.scid,
        dids: JSON.stringify([...new Set([...JSON.parse(existing?.dids ?? '[]'), ...params.dids])]),
        proofs: JSON.stringify(proofSets),
      }));
    }));
  }

  async getWitnessProofsForScid(scid: string): Promise<WitnessProofFileEntry[]> {
    return this.withDb(async db => {
      const entity = await db.getRepository(WebvhWitnessProof).findOneBy({ scid });
      return JSON.parse(entity?.proofs ?? '[]');
    });
  }

  async getWitnessProofsForDid(did: string): Promise<WitnessProofFileEntry[]> {
    return this.getWitnessProofsForScid(WebvhDidLogStore.extractScid(did));
  }

  /** Also finds the proof publication for a DID whose genesis log is not yet public. */
  async getWitnessProofsForDomainPath(domainPath: string): Promise<WitnessProofFileEntry[] | null> {
    return this.withDb(async db => {
      const records = await db.getRepository(WebvhWitnessProof).find();
      const record = records.find(entity => JSON.parse(entity.dids).some((did: string) => did.split(':').slice(3).join(':') === domainPath));
      return record ? JSON.parse(record.proofs) : null;
    });
  }

  /**
   * Look up a DID log by its SCID (permanent identifier).
   */
  async getByScid(scid: string): Promise<WebvhDidLog | null> {
    return this.withDb(db => db.getRepository(WebvhDidLog).findOneBy({ scid }));
  }

  /**
   * Look up a DID log by its current DID string.
   */
  async getByDid(did: string): Promise<WebvhDidLog | null> {
    return this.withDb(async db => {
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
    });
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
    return this.withDb(async db => {
      const result = await db.getRepository(WebvhDidLog).delete({ scid });
      return (result.affected ?? 0) > 0;
    });
  }

  /**
   * Get all stored DID logs.
   */
  async getAllLogs(): Promise<WebvhDidLog[]> {
    return this.withDb(db => db.getRepository(WebvhDidLog).find());
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
