import type { DIDLog, WitnessParameter, WitnessProofFileEntry } from 'didwebvh-ts';
import type { IAgentContext, IKeyManager, IService } from '@veramo/core';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';

/** The witness list and approval threshold defined by WebVH. @public */
export type WebvhWitnessConfiguration = WitnessParameter;

/** Candidate history submitted to independently operated witnesses. @public */
export interface WebvhWitnessRequest {
  did: string;
  log: DIDLog;
  requiredWitnesses: WebvhWitnessConfiguration;
}

/**
 * Retrieves witness approvals for a candidate. Transport and witness policy are
 * application-specific. The provider verifies every required threshold itself.
 * @public
 */
export type WebvhWitnessProofCollector = (request: WebvhWitnessRequest) => Promise<WitnessProofFileEntry[]>;

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

  /** Collect approvals before publishing a witnessed creation, update, or deactivation. */
  witnessProofCollector?: WebvhWitnessProofCollector;

  /** Database connection for DID logs. Portability requires the same DataSource as Veramo DIDStore, with SharedEntities and SharedMigrations. */
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

  /** Existing KMS key references to commit for the next update, instead of generating a future key. */
  nextUpdateKeys?: string[];

  /** Witness configuration. Requires a configured witnessProofCollector. */
  witnesses?: WebvhWitnessConfiguration;

  /** Watcher webhook URLs for tamper detection notifications */
  watchers?: string[];

  /** Existing KMS key IDs to authorize updates; generates one Ed25519 key when omitted. */
  updateKeys?: string[];

  /** Select an authorized KMS signing key when several update keys are available. */
  signingKey?: string;

  /** Key type for the DID's primary key. Defaults to 'Ed25519'. */
  keyType?: 'Ed25519';

  /** Service endpoints to include in the genesis DID document. */
  services?: IService[];
}

/**
 * Options for did:webvh DID update operations.
 * @public
 */
export interface WebvhUpdateIdentifierOptions {
  /** Replace the witness list, or null to disable witnessing after this approved update. */
  witnesses?: WebvhWitnessConfiguration | null;

  /** Port the DID to a new domain. Requires the DID to have been created with portable: true. */
  portToDomain?: string;

  /** New URL path segments when porting */
  portToPaths?: string[];

  /** Rotate update keys. Provide new key references. */
  updateKeys?: string[];

  /** Select the KMS key to sign this update. It must be authorized by the log. */
  signingKey?: string;

  /** New pre-rotation key hashes (activates/changes pre-rotation) */
  nextKeyHashes?: string[];

  /** Commit managed future key references, persisting their KMS association. Mutually exclusive with nextKeyHashes. */
  nextUpdateKeys?: string[];
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
