import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { once } from 'node:events';
import { get, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { bytesToMultibase, hexToBytes } from '@veramo/utils';
import { Resolver } from 'did-resolver';
import type { IKey } from '@veramo/core';
import type { DataIntegrityProofTemplate, WitnessProofFileEntry } from 'didwebvh-ts';
import { WebvhDidDocRouter } from '../webvh-did-doc-router.js';
import { WebvhDidLogStore } from '../store/webvh-did-log-store.js';
import { getWebvhLocalResolver } from '../webvh-did-resolver.js';
import { VeramoSigner } from '../veramo-signer.js';
import { WebvhDIDProvider } from '../webvh-did-provider.js';
import type { WebvhWitnessRequest } from '../types.js';
import { agentFixture } from './agent-fixture.js';

let issuer: Awaited<ReturnType<typeof agentFixture>>;
let witnesses: Awaited<ReturnType<typeof agentFixture>>;
let keys: Map<string, IKey>;
let requests: WebvhWitnessRequest[];
let mode: 'valid' | 'stale' | 'duplicate' | 'invalid';
let server: Server;
let base: string;
const configuration = () => ({ threshold: 2, witnesses: [...keys.keys()].map(id => ({ id })) });

async function collect(request: WebvhWitnessRequest): Promise<WitnessProofFileEntry[]> {
  requests.push(request);
  const entry = mode === 'stale' ? request.log[0] : request.log[request.log.length - 1];
  const proof = await Promise.all(request.requiredWitnesses.witnesses!.map(async ({ id }) => {
    const key = keys.get(id)!;
    const multikey = id.slice('did:key:'.length);
    const signer = new VeramoSigner(key.kid, `${id}#${multikey}`, witnesses.context);
    const template: DataIntegrityProofTemplate = {
      type: 'DataIntegrityProof', cryptosuite: 'eddsa-jcs-2022', proofPurpose: 'assertionMethod',
      verificationMethod: signer.getVerificationMethodId(), created: entry.versionTime,
    };
    return { ...template, ...await signer.sign({ document: { versionId: entry.versionId }, proof: template }) };
  }));
  if (mode === 'duplicate') proof.splice(0, proof.length, proof[0], proof[0]);
  if (mode === 'invalid') for (const item of proof) item.proofValue = item.proofValue.slice(0, -1) + (item.proofValue.endsWith('1') ? '2' : '1');
  return [{ versionId: entry.versionId, proof }];
}

beforeEach(async () => {
  witnesses = await agentFixture();
  keys = new Map();
  for (let index = 0; index < 2; index++) {
    const key = await witnesses.agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' });
    keys.set('did:key:' + bytesToMultibase(hexToBytes(key.publicKeyHex), 'Ed25519'), key);
  }
  requests = [];
  mode = 'valid';
  issuer = await agentFixture({ witnessProofCollector: collect });
  server = express().use(WebvhDidDocRouter({ dbConnection: issuer.db })).listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterEach(async () => {
  jest.restoreAllMocks();
  server?.closeAllConnections();
  if (server) await new Promise<void>(resolve => server.close(() => resolve()));
  if (issuer?.db.isInitialized) await issuer.db.destroy();
  if (witnesses?.db.isInitialized) await witnesses.db.destroy();
});
function request(path: string, host = 'example.com') {
  return new Promise<{ status: number; body: string; cache: string | undefined }>((resolve, reject) => {
    get(base + path, { headers: { Host: host } }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode!, body, cache: response.headers['cache-control'] }));
      response.on('error', reject);
    }).on('error', reject);
  });
}

const resolve = (did: string) => new Resolver(getWebvhLocalResolver(issuer.logStore)).resolve(did);

describe('witness approval and publication', () => {
  it('serves validated proofs before publishing the genesis log', async () => {
    const save = WebvhDidLogStore.prototype.saveLog;
    const observation = jest.spyOn(WebvhDidLogStore.prototype, 'saveLog').mockImplementation(async function (this: WebvhDidLogStore, params) {
      const proofs = await request('/.well-known/did-witness.json');
      expect(proofs.status).toBe(200);
      expect(proofs.cache).toBe('no-store');
      expect(JSON.parse(proofs.body)[0].versionId).toBe(params.log[0].versionId);
      expect((await request('/.well-known/did.jsonl')).status).toBe(404);
      return save.call(this, params);
    });
    const identifier = await issuer.agent.didManagerCreate({ options: { witnesses: configuration() } });
    expect(observation).toHaveBeenCalledTimes(1);
    expect((await resolve(identifier.did)).didResolutionMetadata.error).toBeUndefined();
    expect((await request('/.well-known/did.json')).status).toBe(200);
  });

  it('requires the previous witness list to approve a replacement, then uses the new list through restart and deactivation', async () => {
    const identifier = await issuer.agent.didManagerCreate({ options: { witnesses: configuration(), paths: ['issuer'] } });
    const update = WebvhDidLogStore.prototype.updateLog;
    const observation = jest.spyOn(WebvhDidLogStore.prototype, 'updateLog').mockImplementation(async function (this: WebvhDidLogStore, params) {
      const published = await request('/issuer/did.jsonl');
      expect(published.body.trim().split('\n')).toHaveLength(params.log.length - 1);
      const proofs = JSON.parse((await request('/issuer/did-witness.json')).body);
      expect(proofs.some((entry: any) => entry.versionId === params.log[params.log.length - 1].versionId)).toBe(true);
      return update.call(this, params);
    });
    const next = { threshold: 1, witnesses: [{ id: [...keys.keys()][0] }] };
    await issuer.agent.didManagerUpdate({ did: identifier.did, document: {}, options: { witnesses: next } });
    expect(requests[1].requiredWitnesses).toEqual(configuration());
    const restarted = new WebvhDIDProvider({ defaultKms: 'local', dbConnection: issuer.db, witnessProofCollector: collect });
    await restarted.updateIdentifier({ did: identifier.did, document: {} }, issuer.context);
    expect(requests[2].requiredWitnesses).toEqual(next);
    await restarted.deleteIdentifier(identifier, issuer.context);
    expect(requests[3].requiredWitnesses).toEqual(next);
    expect(observation).toHaveBeenCalledTimes(3);
    const result = await resolve(identifier.did);
    expect(result.didResolutionMetadata.error).toBeUndefined();
    expect(result.didDocumentMetadata.deactivated).toBe(true);
  });

  it.each(['stale', 'duplicate', 'invalid'] as const)('rejects %s approvals without publishing an update or its proofs', async failure => {
    const identifier = await issuer.agent.didManagerCreate({ options: { witnesses: configuration() } });
    const before = await issuer.logStore.getWitnessProofsForDid(identifier.did);
    mode = failure;
    await expect(issuer.agent.didManagerUpdate({ did: identifier.did, document: {} })).rejects.toThrow('Witness threshold not met');
    expect(await issuer.logStore.getLogForDid(identifier.did)).toHaveLength(1);
    expect(await issuer.logStore.getWitnessProofsForDid(identifier.did)).toEqual(before);
    expect((await resolve(identifier.did)).didResolutionMetadata.error).toBeUndefined();
  });

  it('retains published approvals after a failed log write and safely ignores the pending proofs on retry', async () => {
    const identifier = await issuer.agent.didManagerCreate({ options: { witnesses: configuration() } });
    const append = jest.spyOn(WebvhDidLogStore.prototype, 'updateLog').mockRejectedValueOnce(new Error('injected publication failure'));
    await expect(issuer.agent.didManagerUpdate({ did: identifier.did, document: {} })).rejects.toThrow('injected publication failure');
    expect(await issuer.logStore.getLogForDid(identifier.did)).toHaveLength(1);
    expect(await issuer.logStore.getWitnessProofsForDid(identifier.did)).toHaveLength(2);
    expect((await resolve(identifier.did)).didResolutionMetadata.error).toBeUndefined();
    append.mockRestore();
    await issuer.agent.didManagerUpdate({ did: identifier.did, document: {} });
    expect(await issuer.logStore.getLogForDid(identifier.did)).toHaveLength(2);
    expect((await resolve(identifier.did)).didResolutionMetadata.error).toBeUndefined();
  });

  it('keeps proofs available at both locations after portability', async () => {
    const identifier = await issuer.agent.didManagerCreate({ options: { witnesses: configuration() } });
    const moved = await issuer.agent.didManagerUpdate({ did: identifier.did, document: {}, options: { portToDomain: 'new.example' } });
    const oldProofs = await request('/.well-known/did-witness.json');
    const newProofs = await request('/.well-known/did-witness.json', 'new.example');
    expect(oldProofs.status).toBe(200);
    expect(newProofs.status).toBe(200);
    expect(oldProofs.body).toBe(newProofs.body);
    expect((await resolve(moved.did)).didResolutionMetadata.error).toBeUndefined();
  });
});
