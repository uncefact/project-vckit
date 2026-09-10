import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { DataSource } from 'typeorm';
import { updateDID } from 'didwebvh-ts';
import { WebvhDidLog } from '../entities/webvh-did-log.js';
import { WebvhDidLogStore } from '../store/webvh-did-log-store.js';
import { migrations } from '../migrations/index.js';
import { signedHistory } from './fixtures.js';

let db: DataSource;
beforeEach(async () => {
  db = await new DataSource({ type: 'sqljs', entities: [WebvhDidLog], migrations, migrationsRun: true }).initialize();
});
afterEach(async () => { if (db?.isInitialized) await db.destroy(); });

describe('WebVH history persistence', () => {
  it('allows only one competing append to succeed', async () => {
    const { genesis, signer, verifier } = await signedHistory();
    const scid = genesis.meta.scid;
    const store = new WebvhDidLogStore(db);
    const otherStore = new WebvhDidLogStore(db);
    await store.saveLog({ scid, currentDid: genesis.did, log: genesis.log, portable: false });
    const candidates = await Promise.all(['a', 'b'].map(name => updateDID({
      log: genesis.log, signer, verifier,
      services: [{ id: '#' + name, type: 'Profile', serviceEndpoint: 'https://example.com/' + name }],
    })));
    const results = await Promise.allSettled([
      store.updateLog({ scid, log: candidates[0].log }),
      otherStore.updateLog({ scid, log: candidates[1].log }),
    ]);
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(result => result.status === 'rejected')).toHaveLength(1);
    const persisted = await store.getLogForScid(scid);
    expect(persisted).toHaveLength(2);
    expect(persisted![0]).toEqual(genesis.log[0]);
    const winner = results.findIndex(result => result.status === 'fulfilled');
    expect(persisted).toEqual(candidates[winner].log);
  });

  it('rejects attempts to replace, truncate, or recreate an existing history', async () => {
    const { did, log, meta } = await signedHistory();
    const store = new WebvhDidLogStore(db);
    await store.saveLog({ scid: meta.scid, currentDid: did, log, portable: false });
    await expect(store.updateLog({ scid: meta.scid, log: [log[0]] })).rejects.toThrow('conflict');
    await expect(store.updateLog({ scid: meta.scid, log: [log[1], log[1], log[1]] })).rejects.toThrow('conflict');
    await expect(store.saveLog({ scid: meta.scid, currentDid: did, log: [log[0]], portable: false })).rejects.toThrow();
    expect(await store.getLogForScid(meta.scid)).toEqual(log);
  });
});
