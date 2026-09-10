import type { DIDResolutionResult, DIDResolver, DIDDocument, ParsedDID, DIDResolutionOptions } from 'did-resolver';
import {
  resolveDID, resolveDIDFromLog,
  type DIDDoc, type DIDLog, type DIDResolutionMeta, type ResolutionOptions, type WitnessProofFileEntry,
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

type WebvhResult = { doc: DIDDoc | null; meta: Partial<DIDResolutionMeta> };

function resolutionResult(result: WebvhResult): DIDResolutionResult {
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
    didResolutionMetadata: { error: error instanceof InvalidResolutionOptions ? 'invalidOptions' : 'invalidDid', message },
  };
}

class InvalidResolutionOptions extends Error {}

function resolutionOptions(parsed: ParsedDID, supplied: DIDResolutionOptions = {}): ResolutionOptions {
  const options: ResolutionOptions = { verifier: new VeramoVerifier() };
  const query = new URLSearchParams(parsed.query);
  const selectors = ['versionId', 'versionNumber', 'versionTime'] as const;
  let selected = 0;
  for (const name of selectors) {
    const values = query.getAll(name);
    if (values.length > 1) throw new InvalidResolutionOptions(`Duplicate ${name} query parameter`);
    const apiValue = supplied[name];
    const queryValue = values[0];
    if (queryValue === undefined && apiValue === undefined) continue;
    selected++;
    const normalize = (value: unknown): string | number | Date => {
      if (name === 'versionNumber') {
        if (typeof value !== 'number' && (typeof value !== 'string' || !/^[1-9]\d*$/.test(value))) {
          throw new InvalidResolutionOptions('versionNumber must be a positive integer');
        }
        const number = Number(value);
        if (!Number.isSafeInteger(number) || number < 1) throw new InvalidResolutionOptions('versionNumber must be a positive integer');
        return number;
      }
      if (name === 'versionTime') {
        if (!(value instanceof Date) && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value))) {
          throw new InvalidResolutionOptions('versionTime must be a UTC ISO8601 timestamp');
        }
        const time = value instanceof Date ? value : new Date(value as string);
        if (!Number.isFinite(time.getTime()) || (typeof value === 'string' && time.toISOString().slice(0, 19) !== value.slice(0, 19))) {
          throw new InvalidResolutionOptions('Invalid versionTime');
        }
        return time;
      }
      if (typeof value !== 'string' || !/^[1-9]\d*-[1-9A-HJ-NP-Za-km-z]+$/.test(value)) {
        throw new InvalidResolutionOptions('versionId must contain a version number and entry hash');
      }
      return value;
    };
    const value = normalize(apiValue ?? queryValue);
    if (apiValue !== undefined && queryValue !== undefined && String(normalize(queryValue)) !== String(value)) {
      throw new InvalidResolutionOptions(`Conflicting ${name} values in options and DID URL`);
    }
    if (name === 'versionId') options.versionId = value as string;
    if (name === 'versionNumber') options.versionNumber = value as number;
    if (name === 'versionTime') options.versionTime = value as Date;
  }
  if (selected > 1) throw new InvalidResolutionOptions('Specify only one historical version selector');
  return options;
}

// Version 2.8.0 treats versionTime as exclusive. Select the latest version at
// or before the requested instant explicitly, while still verifying the complete
// log for every lookup. Network lookups take O(log n) requests for older times.
async function resolveVersion(
  lookup: (options: ResolutionOptions) => Promise<WebvhResult>,
  options: ResolutionOptions,
): Promise<DIDResolutionResult> {
  if (!options.versionTime) return resolutionResult(await lookup(options));
  const { versionTime, ...base } = options;
  const latest = await lookup(base);
  if (latest.meta.error) return resolutionResult(latest);
  const time = versionTime.getTime();
  if (time >= Date.parse(latest.meta.updated!)) return resolutionResult(latest);
  let low = 1;
  let high = Number(latest.meta.versionId?.split('-')[0]);
  let match: WebvhResult | undefined;
  while (low <= high) {
    const versionNumber = Math.floor((low + high) / 2);
    const candidate = await lookup({ ...base, versionNumber });
    if (candidate.meta.error) return resolutionResult(candidate);
    if (Date.parse(candidate.meta.updated!) <= time) {
      match = candidate;
      low = versionNumber + 1;
    } else {
      high = versionNumber - 1;
    }
  }
  return match ? resolutionResult(match) : {
    didDocument: null, didDocumentMetadata: {},
    didResolutionMetadata: { error: 'notFound', message: 'No DID version exists at the requested time' },
  };
}

/** Creates a network WebVH resolver that preserves verification errors and metadata. @public */
export function getWebvhResolver(): Record<string, DIDResolver> {
  return {
    webvh: async (_didUrl, parsed, _resolver, options) => {
      try {
        return await resolveVersion(selectors => resolveDID(parsed.did, selectors), resolutionOptions(parsed, options));
      } catch (error) {
        return failedResolution(error);
      }
    },
  };
}

/** Resolves managed logs locally, falling back to HTTPS only when no local log exists. @public */
export function getWebvhLocalResolver(
  logStore: {
    getLogForDid: (did: string) => Promise<DIDLog | null>;
    getWitnessProofsForDid?: (did: string) => Promise<WitnessProofFileEntry[]>;
  },
): Record<string, DIDResolver> {
  const network = getWebvhResolver();
  return {
    webvh: async (didUrl, parsed, resolver, options) => {
      try {
        const selectors = resolutionOptions(parsed, options);
        const log = await logStore.getLogForDid(parsed.did);
        if (log === null) return network.webvh(didUrl, parsed, resolver, options);
        const witnessProofs = await logStore.getWitnessProofsForDid?.(parsed.did) ?? [];
        return await resolveVersion(selected => resolveDIDFromLog(log, { ...selected, scid: parsed.id.split(':')[0], witnessProofs }), selectors);
      } catch (error) {
        return failedResolution(error);
      }
    },
  };
}
