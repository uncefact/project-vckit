import type { DIDResolutionResult, DIDResolver, DIDDocument, ParsedDID } from 'did-resolver';
import {
  resolveDID, resolveDIDFromLog,
  type DIDDoc, type DIDLog, type DIDResolutionMeta, type ResolutionOptions,
} from 'didwebvh-ts';
import { VeramoVerifier } from './veramo-signer.js';

function errorCode(error: string): string {
  switch (error) {
    case 'NOT_FOUND': case 'notFound': return 'notFound';
    case 'INVALID_DID_URL': case 'invalidDidUrl': return 'invalidDidUrl';
    case 'INVALID_OPTIONS': case 'invalidOptions': return 'invalidOptions';
    default: return 'invalidDid';
  }
}

function resolutionResult(result: { doc: DIDDoc | null; meta: Partial<DIDResolutionMeta> }): DIDResolutionResult {
  const { error, problemDetails, ...metadata } = result.meta;
  return {
    didDocument: result.doc as DIDDocument | null,
    didDocumentMetadata: metadata,
    didResolutionMetadata: {
      ...(result.doc ? { contentType: 'application/did+ld+json' } : {}),
      ...(error ? { error: errorCode(error), ...(problemDetails ? { problemDetails, message: problemDetails.detail } : {}) } : {}),
    },
  };
}

function failedResolution(error: unknown): DIDResolutionResult {
  const message = error instanceof Error ? error.message : String(error);
  return {
    didDocument: null,
    didDocumentMetadata: {},
    didResolutionMetadata: { error: 'invalidDid', message },
  };
}

function resolutionOptions(parsed: ParsedDID): ResolutionOptions {
  const options: ResolutionOptions = { verifier: new VeramoVerifier() };
  const query = new URLSearchParams(parsed.query);
  if (query.has('versionId')) options.versionId = query.get('versionId')!;
  if (query.has('versionTime')) options.versionTime = new Date(query.get('versionTime')!);
  if (query.has('versionNumber')) options.versionNumber = Number(query.get('versionNumber'));
  return options;
}

/** Creates a network WebVH resolver that preserves verification errors and metadata. @public */
export function getWebvhResolver(): Record<string, DIDResolver> {
  return {
    webvh: async (_didUrl, parsed) => {
      try {
        return resolutionResult(await resolveDID(parsed.did, resolutionOptions(parsed)));
      } catch (error) {
        return failedResolution(error);
      }
    },
  };
}

/** Resolves managed logs locally, falling back to HTTPS only when no local log exists. @public */
export function getWebvhLocalResolver(
  logStore: { getLogForDid: (did: string) => Promise<DIDLog | null> },
): Record<string, DIDResolver> {
  const network = getWebvhResolver();
  return {
    webvh: async (didUrl, parsed, resolver, options) => {
      try {
        const log = await logStore.getLogForDid(parsed.did);
        if (log === null) return network.webvh(didUrl, parsed, resolver, options);
        return resolutionResult(await resolveDIDFromLog(log, { ...resolutionOptions(parsed), scid: parsed.id.split(':')[0] }));
      } catch (error) {
        return failedResolution(error);
      }
    },
  };
}
