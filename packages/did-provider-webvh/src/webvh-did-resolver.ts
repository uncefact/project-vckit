import {
  DIDResolutionResult,
  DIDResolver,
  DIDDocument,
  ParsedDID,
  Resolvable,
  DIDResolutionOptions,
} from 'did-resolver';

/**
 * Creates a did:webvh DID resolver compatible with @veramo/did-resolver.
 *
 * The resolver fetches and verifies the full DID log chain, supporting:
 * - Standard resolution (latest version)
 * - Version-specific resolution (versionId, versionTime, versionNumber)
 * - Portability chain following (resolves moved DIDs)
 *
 * @returns A resolver map `{ webvh: resolve }` for use with DIDResolverPlugin
 *
 * @public
 */
export function getWebvhResolver(): Record<string, DIDResolver> {
  async function resolve(
    didUrl: string,
    parsed: ParsedDID,
    resolver: Resolvable,
    options: DIDResolutionOptions,
  ): Promise<DIDResolutionResult> {
    try {
      const { resolveDID } = await import('didwebvh-ts');
      const { VeramoVerifier } = await import('./veramo-signer.js');

      // Parse version-related query parameters from the DID URL
      const resolutionOptions: any = {
        verifier: new VeramoVerifier(),
      };

      // did:webvh supports version resolution via query params
      if (parsed.query) {
        const params = new URLSearchParams(parsed.query);
        if (params.has('versionId')) {
          resolutionOptions.versionId = params.get('versionId');
        }
        if (params.has('versionTime')) {
          resolutionOptions.versionTime = new Date(params.get('versionTime')!);
        }
        if (params.has('versionNumber')) {
          resolutionOptions.versionNumber = parseInt(
            params.get('versionNumber')!,
            10,
          );
        }
      }

      // Resolve the DID via didwebvh-ts
      // This fetches did.jsonl from the HTTPS URL derived from the DID,
      // parses and verifies every log entry in the chain.
      const result = await resolveDID(parsed.did, resolutionOptions);

      // Build the standard DID resolution result
      const didDocument: DIDDocument = result.doc as DIDDocument;
      const meta = result.meta || {};

      return {
        didResolutionMetadata: {
          contentType: 'application/did+ld+json',
        },
        didDocument,
        didDocumentMetadata: {
          created: meta.created,
          updated: meta.updated,
          versionId: meta.versionId,
          deactivated: meta.deactivated || false,
          // did:webvh-specific metadata
          ...(meta.scid && { scid: meta.scid }),
          ...(meta.portable !== undefined && { portable: meta.portable }),
          ...(meta.prerotation !== undefined && { prerotation: meta.prerotation }),
          ...(meta.nextKeyHashes?.length && { nextKeyHashes: meta.nextKeyHashes }),
          ...(meta.updateKeys?.length && { updateKeys: meta.updateKeys }),
          ...(meta.witness && { witness: meta.witness }),
          ...(meta.watchers && { watchers: meta.watchers }),
        },
      };
    } catch (err: any) {
      // Map errors to standard DID resolution error codes
      const errorMessage = err.message || String(err);

      let errorCode = 'notFound';
      if (errorMessage.includes('INVALID_DID')) {
        errorCode = 'invalidDid';
      } else if (errorMessage.includes('METHOD_NOT_SUPPORTED')) {
        errorCode = 'methodNotSupported';
      } else if (errorMessage.includes('INVALID_DID_DOCUMENT')) {
        errorCode = 'invalidDidDocument';
      }

      return {
        didResolutionMetadata: {
          error: errorCode,
          message: errorMessage,
        },
        didDocument: null,
        didDocumentMetadata: {},
      };
    }
  }

  return { webvh: resolve };
}

/**
 * Creates a did:webvh resolver that resolves from a local log store
 * instead of fetching over HTTPS. Useful for resolving locally-managed DIDs.
 *
 * Falls back to the network-based resolver for DIDs not found locally.
 *
 * @param logStore - The WebvhDidLogStore to look up local DID logs
 * @returns A resolver map for use with DIDResolverPlugin
 *
 * @public
 */
export function getWebvhLocalResolver(
  logStore: { getLogForDid: (did: string) => Promise<any[] | null> },
): Record<string, DIDResolver> {
  async function resolve(
    didUrl: string,
    parsed: ParsedDID,
    resolver: Resolvable,
    options: DIDResolutionOptions,
  ): Promise<DIDResolutionResult> {
    try {
      // Try local resolution first
      const localLog = await logStore.getLogForDid(parsed.did);

      if (localLog) {
        const { resolveDIDFromLog } = await import('didwebvh-ts');
        const { VeramoVerifier } = await import('./veramo-signer.js');

        const resolutionOptions: any = {
          verifier: new VeramoVerifier(),
        };

        if (parsed.query) {
          const params = new URLSearchParams(parsed.query);
          if (params.has('versionId')) {
            resolutionOptions.versionId = params.get('versionId');
          }
          if (params.has('versionTime')) {
            resolutionOptions.versionTime = new Date(
              params.get('versionTime')!,
            );
          }
          if (params.has('versionNumber')) {
            resolutionOptions.versionNumber = parseInt(
              params.get('versionNumber')!,
              10,
            );
          }
        }

        const result = await resolveDIDFromLog(localLog, resolutionOptions);

        const didDocument: DIDDocument = result.doc as DIDDocument;
        const meta = result.meta || {};

        return {
          didResolutionMetadata: {
            contentType: 'application/did+ld+json',
          },
          didDocument,
          didDocumentMetadata: {
            created: meta.created,
            updated: meta.updated,
            versionId: meta.versionId,
            deactivated: meta.deactivated || false,
            ...(meta.scid && { scid: meta.scid }),
            ...(meta.portable !== undefined && { portable: meta.portable }),
            ...(meta.prerotation !== undefined && {
              prerotation: meta.prerotation,
            }),
            ...(meta.nextKeyHashes?.length && {
              nextKeyHashes: meta.nextKeyHashes,
            }),
            ...(meta.updateKeys?.length && { updateKeys: meta.updateKeys }),
            ...(meta.witness && { witness: meta.witness }),
            ...(meta.watchers && { watchers: meta.watchers }),
          },
        };
      }

      // Fall back to network resolver
      const networkResolver = getWebvhResolver();
      return networkResolver.webvh(didUrl, parsed, resolver, options);
    } catch (err: any) {
      return {
        didResolutionMetadata: {
          error: 'notFound',
          message: err.message || String(err),
        },
        didDocument: null,
        didDocumentMetadata: {},
      };
    }
  }

  return { webvh: resolve };
}
