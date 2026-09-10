import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { parse, type DIDResolver, type DIDResolutionOptions } from 'did-resolver';
import { getWebvhResolver, getWebvhLocalResolver } from '../webvh-did-resolver.js';
import { signedHistory } from './fixtures.js';

export function resolveWith(resolver: DIDResolver, did: string, options: DIDResolutionOptions = {}) {
  return resolver(did, parse(did)!, {} as any, options);
}
function serve(log: unknown[]) {
  return jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(log.map(entry => JSON.stringify(entry)).join('\n')));
}
afterEach(() => { jest.restoreAllMocks(); });

describe('WebVH resolution', () => {
  it('returns a verified document and protocol metadata', async () => {
    const { did, log } = await signedHistory();
    serve(log);
    const result = await resolveWith(getWebvhResolver().webvh, did);
    expect(result.didResolutionMetadata.error).toBeUndefined();
    expect(result.didDocument?.id).toBe(did);
    expect(result.didDocumentMetadata.versionId).toBe(log[1].versionId);
  });

  it('preserves a network validation error for a tampered log', async () => {
    const { did, log } = await signedHistory();
    log[0].state.alsoKnownAs = ['https://tampered.example'];
    serve(log);
    const result = await resolveWith(getWebvhResolver().webvh, did);
    expect(result.didDocument).toBeNull();
    expect(result.didResolutionMetadata.error).toBe('invalidDid');
    expect(result.didResolutionMetadata.problemDetails).toBeDefined();
  });

  it('reports an absent network log as notFound', async () => {
    const { did } = await signedHistory();
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('not found', { status: 404 }));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect((await resolveWith(getWebvhResolver().webvh, did)).didResolutionMetadata.error).toBe('notFound');
  });

  it('rejects a corrupt local log without falling back to the network', async () => {
    const { did, log } = await signedHistory();
    log[1].proof![0].proofValue = 'z111';
    const fetch = jest.spyOn(globalThis, 'fetch');
    const resolver = getWebvhLocalResolver({ getLogForDid: async () => log });
    const result = await resolveWith(resolver.webvh, did);
    expect(result.didDocument).toBeNull();
    expect(result.didResolutionMetadata.error).toBe('invalidDid');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('binds a local log to the SCID that was requested', async () => {
    const { log } = await signedHistory();
    const other = await signedHistory();
    const result = await resolveWith(getWebvhLocalResolver({ getLogForDid: async () => log }).webvh, other.did);
    expect(result.didResolutionMetadata.error).toBe('invalidDid');
  });

  it('falls back to the network when no local log exists', async () => {
    const { did, log } = await signedHistory();
    const fetch = serve(log);
    const result = await resolveWith(getWebvhLocalResolver({ getLogForDid: async () => null }).webvh, did);
    expect(result.didDocument?.id).toBe(did);
    expect(fetch).toHaveBeenCalled();
  });

  it('supports historical versions in DID URL queries', async () => {
    const { did, log } = await signedHistory();
    const result = await resolveWith(getWebvhLocalResolver({ getLogForDid: async () => log }).webvh, `${did}?versionNumber=1`);
    expect(result.didDocumentMetadata.versionId).toBe(log[0].versionId);
  });
});

describe('historical resolution options', () => {
  it.each(['network', 'local'])('honors API versionId, versionNumber and versionTime through the %s resolver', async mode => {
    const { did, log } = await signedHistory();
    jest.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(log.map(entry => JSON.stringify(entry)).join('\n')));
    const resolver = mode === 'local' ? getWebvhLocalResolver({ getLogForDid: async () => log }) : getWebvhResolver();
    for (const options of [{ versionId: log[0].versionId }, { versionNumber: 1 }, { versionTime: '2026-01-01T00:00:00Z' }]) {
      const result = await resolveWith(resolver.webvh, did, options);
      expect(result.didResolutionMetadata.error).toBeUndefined();
      expect(result.didDocumentMetadata.versionId).toBe(log[0].versionId);
    }
  });

  it.each([
    ['?versionNumber=2', { versionNumber: 1 }],
    ['?versionNumber=1&versionNumber=2', {}],
    ['?versionNumber=1.5', {}],
    ['?versionNumber=1garbage', {}],
    ['', { versionNumber: 0 }],
    ['', { versionTime: '2026-02-30T00:00:00Z' }],
    ['', { versionNumber: 1, versionTime: '2026-01-01T00:00:00Z' }],
  ] as [string, DIDResolutionOptions][])('rejects invalid or conflicting selectors: %s %j', async (query, options) => {
    const { did } = await signedHistory();
    const fetch = jest.spyOn(globalThis, 'fetch');
    const result = await resolveWith(getWebvhResolver().webvh, did + query, options);
    expect(result.didResolutionMetadata.error).toBe('invalidOptions');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('accepts matching API/query selectors and ignores unrelated extension parameters', async () => {
    const { did, log } = await signedHistory();
    const result = await resolveWith(getWebvhLocalResolver({ getLogForDid: async () => log }).webvh, `${did}?versionNumber=1&extension=value`, { versionNumber: 1 });
    expect(result.didDocumentMetadata.versionId).toBe(log[0].versionId);
  });
});
