import { IAgentContext, IKeyManager, IIdentifier, IService, IKey } from '@uncefact/vckit-core-types';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';

/**
 * Configuration for the did:webvh provider, passed as constructor args.
 * @public
 */
export interface WebvhDIDProviderOptions {
  /** Key Management System to use by default (e.g. 'local') */
  defaultKms: string;

  /** Default domain for hosting DID documents when none is specified in create options */
  defaultDomain?: string;

  /** Default value for portable flag on new DIDs (defaults to true) */
  defaultPortable?: boolean;

  /** Database connection for storing DID logs */
  dbConnection: OrPromise<DataSource>;
}

/**
 * Options specific to did:webvh DID creation, passed via `didManagerCreate({ options })`.
 * @public
 */
export interface WebvhCreateIdentifierOptions {
  /** Hosting domain for the DID (e.g. 'example.com'). Required if no defaultDomain configured. */
  domain?: string;

  /** URL path segments (e.g. ['dids', 'issuer'] → example.com/dids/issuer/did.jsonl) */
  paths?: string[];

  /** Enable DID portability. Immutable after creation. Defaults to provider's defaultPortable (true). */
  portable?: boolean;

  /** Enable pre-rotation keys for key compromise protection */
  preRotation?: boolean;

  /** Witness configuration for multi-party DID update approval */
  witnesses?: {
    threshold: number;
    witnesses: Array<{ id: string; weight?: number }>;
  };

  /** Watcher webhook URLs for tamper detection notifications */
  watchers?: string[];

  /** Key type for the DID's primary key. Defaults to 'Ed25519'. */
  keyType?: 'Ed25519';
}

/**
 * Options for did:webvh DID update operations.
 * @public
 */
export interface WebvhUpdateIdentifierOptions {
  /** Port the DID to a new domain. Requires the DID to have been created with portable: true. */
  portToDomain?: string;

  /** New URL path segments when porting */
  portToPaths?: string[];

  /** Rotate update keys. Provide new key references. */
  updateKeys?: string[];

  /** New pre-rotation key hashes (activates/changes pre-rotation) */
  nextKeyHashes?: string[];
}

/**
 * The context required by the did:webvh provider methods.
 * @public
 */
export type WebvhProviderContext = IAgentContext<IKeyManager>;

/**
 * Arguments for the internal createIdentifier method on AbstractIdentifierProvider.
 * @public
 */
export interface WebvhCreateIdentifierArgs {
  kms?: string;
  alias?: string;
  options?: WebvhCreateIdentifierOptions;
}

/**
 * Arguments for the internal updateIdentifier method on AbstractIdentifierProvider.
 * @public
 */
export interface WebvhUpdateIdentifierArgs {
  did: string;
  document: Record<string, any>;
  options?: WebvhUpdateIdentifierOptions;
}

/**
 * Stored metadata about a did:webvh DID, persisted alongside the DID log.
 * @public
 */
export interface WebvhDidMetadata {
  /** Self-Certifying Identifier — permanent, derived from genesis log entry hash */
  scid: string;

  /** Current DID string (changes on port) */
  currentDid: string;

  /** All previous DID strings (populated on port) */
  previousDids: string[];

  /** Whether the DID was created with portable: true */
  portable: boolean;

  /** Whether the DID has been deactivated */
  deactivated: boolean;
}
