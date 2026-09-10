import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { bytesToMultibase, hexToBytes } from '@veramo/utils';
import { deriveNextKeyHash, resolveDIDFromLog } from 'didwebvh-ts';
import { WebvhDIDProvider } from '../webvh-did-provider.js';
import { VeramoVerifier } from '../veramo-signer.js';
import { agentFixture } from './agent-fixture.js';

let fixture: Awaited<ReturnType<typeof agentFixture>>;
beforeEach(async () => { fixture = await agentFixture(); });
afterEach(async () => { if (fixture?.db.isInitialized) await fixture.db.destroy(); });

describe('managed WebVH lifecycle', () => {
  it('creates a signed, persisted DID using the actual Veramo local KMS', async () => {
    const { agent, logStore } = fixture;
    const identifier = await agent.didManagerCreate({});
    const log = (await logStore.getLogForDid(identifier.did))!;
    const result = await resolveDIDFromLog(log, { verifier: new VeramoVerifier() });
    expect(result.did).toBe(identifier.did);
    expect(log[0].proof![0].proofValue).toMatch(/^z/);
    expect(identifier.controllerKeyId).toBe(identifier.keys[0].kid);
  });

  it('signs later updates and deactivation with the rotated key after provider restart', async () => {
    const { agent, logStore, db, context } = fixture;
    const identifier = await agent.didManagerCreate({});
    const next = await agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' });
    const nextMultikey = bytesToMultibase(hexToBytes(next.publicKeyHex), 'Ed25519');
    await agent.didManagerUpdate({ did: identifier.did, document: {}, options: { updateKeys: [next.kid] } });
    const restarted = new WebvhDIDProvider({ defaultKms: 'local', dbConnection: db });
    await restarted.addService({ identifier, service: { id: '#profile', type: 'Profile', serviceEndpoint: 'https://example.com/profile' } }, context);
    let log = (await logStore.getLogForDid(identifier.did))!;
    expect(log[2].proof![0].verificationMethod).toBe(`did:key:${nextMultikey}#${nextMultikey}`);
    await restarted.deleteIdentifier(identifier, context);
    log = (await logStore.getLogForDid(identifier.did))!;
    expect(log[3].proof![0].verificationMethod).toBe(`did:key:${nextMultikey}#${nextMultikey}`);
    expect((await resolveDIDFromLog(log, { verifier: new VeramoVerifier() })).meta.deactivated).toBe(true);
  });

  it('rejects a removed signing key without changing the history', async () => {
    const { agent, logStore } = fixture;
    const identifier = await agent.didManagerCreate({});
    const next = await agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' });
    await agent.didManagerUpdate({ did: identifier.did, document: {}, options: { updateKeys: [next.kid] } });
    await expect(agent.didManagerUpdate({ did: identifier.did, document: {}, options: { signingKey: identifier.controllerKeyId } })).rejects.toThrow('not authorized');
    expect(await logStore.getLogForDid(identifier.did)).toHaveLength(2);
  });

  it('can select any authorized update key rather than relying on identifier key order', async () => {
    const { agent, logStore } = fixture;
    const first = await agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' });
    const second = await agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' });
    const identifier = await agent.didManagerCreate({ options: { updateKeys: [first.kid, second.kid], signingKey: second.kid } });
    await agent.didManagerUpdate({ did: identifier.did, document: {}, options: { signingKey: second.kid } });
    const log = (await logStore.getLogForDid(identifier.did))!;
    const secondMultikey = bytesToMultibase(hexToBytes(second.publicKeyHex), 'Ed25519');
    expect(log[1].proof![0].verificationMethod).toBe(`did:key:${secondMultikey}#${secondMultikey}`);
    expect((await resolveDIDFromLog(log, { verifier: new VeramoVerifier() })).meta.updateKeys).toHaveLength(2);
  });
});

describe('managed pre-rotation', () => {
  it('persists hashed future keys, rotates after restart, and deactivates', async () => {
    const { agent, logStore, db, context } = fixture;
    const identifier = await agent.didManagerCreate({ options: { preRotation: true } });
    let log = (await logStore.getLogForDid(identifier.did))!;
    const entity = (await logStore.getByDid(identifier.did))!;
    const refs = JSON.parse(entity.updateKeyRefs);
    const futureKey = Object.keys(refs).find(key => !log[0].parameters.updateKeys.includes(key))!;
    expect(log[0].parameters.nextKeyHashes).toEqual([await deriveNextKeyHash(futureKey)]);
    expect(log[0].parameters.nextKeyHashes).not.toContain(futureKey);
    const restarted = new WebvhDIDProvider({ defaultKms: 'local', dbConnection: db });
    await restarted.updateIdentifier({ did: identifier.did, document: {} }, context);
    log = (await logStore.getLogForDid(identifier.did))!;
    expect(log[1].parameters.updateKeys).toEqual([futureKey]);
    expect(log[1].proof[0].verificationMethod).toBe(`did:key:${futureKey}#${futureKey}`);
    await restarted.deleteIdentifier(identifier, context);
    log = (await logStore.getLogForDid(identifier.did))!;
    expect(log).toHaveLength(4);
    expect((await resolveDIDFromLog(log, { verifier: new VeramoVerifier() })).meta.deactivated).toBe(true);
  });

  it('rejects an uncommitted rotation without publishing it', async () => {
    const { agent, logStore } = fixture;
    const identifier = await agent.didManagerCreate({ options: { preRotation: true } });
    const unrelated = await agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' });
    await expect(agent.didManagerUpdate({ did: identifier.did, document: {}, options: { updateKeys: [unrelated.kid] } })).rejects.toThrow('pre-rotation commitment');
    expect(await logStore.getLogForDid(identifier.did)).toHaveLength(1);
  });
});

it('supports explicit managed future keys across consecutive pre-rotation updates', async () => {
  const { agent, logStore } = fixture;
  const first = await agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' });
  const second = await agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' });
  const identifier = await agent.didManagerCreate({ options: { nextUpdateKeys: [first.kid] } });
  await agent.didManagerUpdate({ did: identifier.did, document: {}, options: { nextUpdateKeys: [second.kid] } });
  await agent.didManagerUpdate({ did: identifier.did, document: {}, options: { nextUpdateKeys: [] } });
  const log = (await logStore.getLogForDid(identifier.did))!;
  const resolved = await resolveDIDFromLog(log, { verifier: new VeramoVerifier() });
  expect(resolved.meta.prerotation).toBe(false);
  expect(resolved.meta.updateKeys).toEqual([bytesToMultibase(hexToBytes(second.publicKeyHex), 'Ed25519')]);
});
