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
