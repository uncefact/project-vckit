import { AbstractIdentifierProvider } from '@veramo/did-manager';
import { IIdentifier, IKey, IService, IAgentContext, IKeyManager } from '@uncefact/vckit-core-types';
import { bytesToMultibase, hexToBytes } from '@veramo/utils';
import { VeramoSigner, VeramoVerifier } from './veramo-signer.js';
import { WebvhDidLogStore } from './store/webvh-did-log-store.js';
import {
  WebvhDIDProviderOptions,
  WebvhCreateIdentifierOptions,
  WebvhUpdateIdentifierOptions,
  WebvhProviderContext,
} from './types.js';

/**
 * did:webvh DID Provider for Veramo.
 *
 * Implements the full did:webvh lifecycle: create, resolve (via separate resolver),
 * update, deactivate, and DID portability. Delegates cryptographic operations to
 * didwebvh-ts and key management to Veramo's IKeyManager.
 *
 * @public
 */
export class WebvhDIDProvider extends AbstractIdentifierProvider {
  private defaultKms: string;
  private defaultDomain?: string;
  private defaultPortable: boolean;
  private logStore: WebvhDidLogStore;

  constructor(options: WebvhDIDProviderOptions) {
    super();
    this.defaultKms = options.defaultKms;
    this.defaultDomain = options.defaultDomain;
    this.defaultPortable = options.defaultPortable ?? true;
    this.logStore = new WebvhDidLogStore(options.dbConnection);
  }

  /**
   * Creates a new did:webvh DID.
   *
   * Generates an Ed25519 key via Veramo KMS, creates the initial DID log entry
   * with SCID, signs it, and persists the log to the database.
   */
  async createIdentifier(
    { kms, alias, options }: { kms?: string; alias?: string; options?: WebvhCreateIdentifierOptions },
    context: WebvhProviderContext,
  ): Promise<Omit<IIdentifier, 'provider'>> {
    const keyManagementSystem = kms || this.defaultKms;
    const domain = options?.domain || this.defaultDomain;
    if (!domain) {
      throw new Error(
        'did:webvh requires a domain. Provide it via options.domain or configure defaultDomain on the provider.',
      );
    }

    const portable = options?.portable ?? this.defaultPortable;

    // 1. Create the Ed25519 key via Veramo KMS
    const key = await context.agent.keyManagerCreate({
      kms: keyManagementSystem,
      type: 'Ed25519',
    });

    // 2. Derive the multibase-encoded public key for didwebvh-ts
    const publicKeyMultibase = bytesToMultibase(
      hexToBytes(key.publicKeyHex),
      'Ed25519',
    );

    // 3. Build the verification method ID (did:key format for the update key)
    const didKeyId = `did:key:${publicKeyMultibase}`;
    const verificationMethodId = `${didKeyId}#${publicKeyMultibase}`;

    // 4. Create the signer bridge
    const signer = new VeramoSigner(key.kid, verificationMethodId, context);

    // 5. Build verification methods for the DID document
    const verificationMethods = [
      {
        type: 'Multikey',
        publicKeyMultibase,
      },
    ];

    // 6. Build create options for didwebvh-ts
    const { createDID } = await import('didwebvh-ts');

    const createOptions: any = {
      domain,
      signer,
      updateKeys: [publicKeyMultibase],
      verificationMethods,
      portable,
      verifier: new VeramoVerifier(),
    };

    if (options?.paths) {
      createOptions.paths = options.paths;
    }

    if (options?.preRotation) {
      // When pre-rotation is enabled, we generate a second key for the next rotation
      const nextKey = await context.agent.keyManagerCreate({
        kms: keyManagementSystem,
        type: 'Ed25519',
      });
      const nextKeyMultibase = bytesToMultibase(
        hexToBytes(nextKey.publicKeyHex),
        'Ed25519',
      );
      // Hash the next key for the pre-rotation commitment
      // didwebvh-ts expects the hash in a specific format
      createOptions.nextKeyHashes = [nextKeyMultibase];
    }

    if (options?.witnesses) {
      createOptions.witness = options.witnesses;
    }

    if (options?.watchers) {
      createOptions.watchers = options.watchers;
    }

    // 7. Create the DID via didwebvh-ts
    const result = await createDID(createOptions);
    const did = result.did;
    const log = result.log;

    // 8. Extract the SCID from the created DID
    const scid = WebvhDidLogStore.extractScid(did);

    // 9. Persist the DID log to the database
    await this.logStore.saveLog({
      scid,
      currentDid: did,
      log,
      portable,
    });

    // 10. Build and return the Veramo IIdentifier
    const identifier: Omit<IIdentifier, 'provider'> = {
      did,
      controllerKeyId: key.kid,
      keys: [key],
      services: [],
    };

    return identifier;
  }

  /**
   * Updates an existing did:webvh DID document.
   *
   * Supports:
   * - Modifying the DID document (verification methods, services, etc.)
   * - Porting the DID to a new domain (via options.portToDomain)
   * - Rotating update keys (via options.updateKeys)
   * - Managing pre-rotation keys (via options.nextKeyHashes)
   */
  async updateIdentifier(
    args: { did: string; document: Record<string, any>; options?: WebvhUpdateIdentifierOptions },
    context: WebvhProviderContext,
  ): Promise<IIdentifier> {
    const { did, document, options } = args;

    // 1. Load the existing DID log
    const scid = WebvhDidLogStore.extractScid(did);
    const logEntity = await this.logStore.getByScid(scid);
    if (!logEntity) {
      throw new Error(`did:webvh DID not found: ${did}`);
    }
    if (logEntity.deactivated) {
      throw new Error(`did:webvh DID has been deactivated: ${did}`);
    }

    const existingLog = JSON.parse(logEntity.log);

    // 2. Get the controlling key for signing
    // Look up the identifier in Veramo's DID store to find the controller key
    const identifier = await context.agent.didManagerGet({ did: logEntity.currentDid });
    const controllerKey = identifier.keys[0];
    if (!controllerKey) {
      throw new Error(`No controller key found for DID: ${did}`);
    }

    const publicKeyMultibase = bytesToMultibase(
      hexToBytes(controllerKey.publicKeyHex),
      'Ed25519',
    );
    const didKeyId = `did:key:${publicKeyMultibase}`;
    const verificationMethodId = `${didKeyId}#${publicKeyMultibase}`;

    const signer = new VeramoSigner(controllerKey.kid, verificationMethodId, context);

    // 3. Handle portability (domain migration)
    const isPorting = !!options?.portToDomain;
    if (isPorting && !logEntity.portable) {
      throw new Error(
        `Cannot port DID ${did}: it was not created with portable: true. ` +
        'Portability must be enabled at creation time and cannot be changed afterwards.',
      );
    }

    // 4. Build update options for didwebvh-ts
    const { updateDID } = await import('didwebvh-ts');

    const updateOptions: any = {
      log: existingLog,
      signer,
      verifier: new VeramoVerifier(),
    };

    // Apply document changes
    if (document.verificationMethod) {
      updateOptions.verificationMethods = document.verificationMethod;
    }
    if (document.service) {
      updateOptions.services = document.service;
    }
    if (document.controller) {
      updateOptions.controller = document.controller;
    }
    if (document.alsoKnownAs) {
      updateOptions.alsoKnownAs = document.alsoKnownAs;
    }
    if (document.authentication) {
      updateOptions.authentication = document.authentication;
    }
    if (document.assertionMethod) {
      updateOptions.assertionMethod = document.assertionMethod;
    }
    if (document.keyAgreement) {
      updateOptions.keyAgreement = document.keyAgreement;
    }

    // Apply provider-specific options
    if (options?.updateKeys) {
      updateOptions.updateKeys = options.updateKeys;
    }
    if (options?.nextKeyHashes) {
      updateOptions.nextKeyHashes = options.nextKeyHashes;
    }

    // Handle domain portability
    if (isPorting) {
      updateOptions.domain = options.portToDomain;
      // Add the current DID to alsoKnownAs for discoverability
      const currentAlsoKnownAs = updateOptions.alsoKnownAs || [];
      if (!currentAlsoKnownAs.includes(logEntity.currentDid)) {
        updateOptions.alsoKnownAs = [...currentAlsoKnownAs, logEntity.currentDid];
      }
    }

    // 5. Execute the update via didwebvh-ts
    const result = await updateDID(updateOptions);
    const newDid = result.did;
    const newLog = result.log;

    // 6. Persist updated log
    const previousDids: string[] = JSON.parse(logEntity.previousDids || '[]');
    if (isPorting) {
      previousDids.push(logEntity.currentDid);
    }

    await this.logStore.updateLog({
      scid,
      currentDid: newDid,
      previousDids: isPorting ? previousDids : undefined,
      log: newLog,
    });

    // 7. If ported, update Veramo's DID store
    if (isPorting && newDid !== logEntity.currentDid) {
      // Import the new DID with the same keys
      try {
        await context.agent.didManagerImport({
          did: newDid,
          provider: 'did:webvh',
          controllerKeyId: controllerKey.kid,
          keys: identifier.keys,
          services: identifier.services,
        });
        // Delete the old DID reference
        await context.agent.didManagerDelete({ did: logEntity.currentDid });
      } catch (e: any) {
        // If import fails, the log is already updated — log a warning
        console.warn(
          `did:webvh port: log updated but Veramo DID store update failed: ${e.message}`,
        );
      }
    }

    // 8. Return the updated identifier
    const updatedIdentifier = await context.agent.didManagerGet({ did: newDid });
    return updatedIdentifier;
  }

  /**
   * Deactivates a did:webvh DID.
   *
   * Appends a final log entry with deactivated: true. After deactivation,
   * the DID can no longer be updated and resolvers will report it as deactivated.
   */
  async deleteIdentifier(
    identifier: IIdentifier,
    context: WebvhProviderContext,
  ): Promise<boolean> {
    const scid = WebvhDidLogStore.extractScid(identifier.did);
    const logEntity = await this.logStore.getByScid(scid);
    if (!logEntity) {
      throw new Error(`did:webvh DID not found: ${identifier.did}`);
    }
    if (logEntity.deactivated) {
      // Already deactivated, just clean up
      return true;
    }

    const existingLog = JSON.parse(logEntity.log);

    // Get the controller key for signing the deactivation entry
    const controllerKey = identifier.keys[0];
    if (!controllerKey) {
      throw new Error(`No controller key found for DID: ${identifier.did}`);
    }

    const publicKeyMultibase = bytesToMultibase(
      hexToBytes(controllerKey.publicKeyHex),
      'Ed25519',
    );
    const didKeyId = `did:key:${publicKeyMultibase}`;
    const verificationMethodId = `${didKeyId}#${publicKeyMultibase}`;

    const signer = new VeramoSigner(controllerKey.kid, verificationMethodId, context);

    // Deactivate via didwebvh-ts
    const { deactivateDID } = await import('didwebvh-ts');

    const result = await deactivateDID({
      log: existingLog,
      signer,
      verifier: new VeramoVerifier(),
    });

    // Persist the deactivation
    await this.logStore.updateLog({
      scid,
      log: result.log,
      deactivated: true,
    });

    return true;
  }

  /**
   * Adds a key (verification method) to the DID document.
   *
   * Creates a new log entry with the additional verification method.
   */
  async addKey(
    { identifier, key, options }: { identifier: IIdentifier; key: IKey; options?: any },
    context: WebvhProviderContext,
  ): Promise<any> {
    const publicKeyMultibase = bytesToMultibase(
      hexToBytes(key.publicKeyHex),
      'Ed25519',
    );

    // Get the current DID document from the log
    const scid = WebvhDidLogStore.extractScid(identifier.did);
    const logEntity = await this.logStore.getByScid(scid);
    if (!logEntity) {
      throw new Error(`did:webvh DID not found: ${identifier.did}`);
    }

    const existingLog = JSON.parse(logEntity.log);
    const currentDoc = existingLog[existingLog.length - 1]?.state;
    const currentVMs = currentDoc?.verificationMethod || [];

    // Add the new verification method
    const newVM = {
      type: 'Multikey',
      publicKeyMultibase,
    };

    return this.updateIdentifier(
      {
        did: identifier.did,
        document: {
          verificationMethod: [...currentVMs, newVM],
        },
      },
      context,
    );
  }

  /**
   * Removes a key (verification method) from the DID document.
   */
  async removeKey(
    { identifier, kid, options }: { identifier: IIdentifier; kid: string; options?: any },
    context: WebvhProviderContext,
  ): Promise<any> {
    const scid = WebvhDidLogStore.extractScid(identifier.did);
    const logEntity = await this.logStore.getByScid(scid);
    if (!logEntity) {
      throw new Error(`did:webvh DID not found: ${identifier.did}`);
    }

    const existingLog = JSON.parse(logEntity.log);
    const currentDoc = existingLog[existingLog.length - 1]?.state;
    const currentVMs = currentDoc?.verificationMethod || [];

    // Filter out the verification method matching the key ID
    const filteredVMs = currentVMs.filter(
      (vm: any) => vm.id !== kid && vm.publicKeyMultibase !== kid,
    );

    if (filteredVMs.length === currentVMs.length) {
      throw new Error(`Key not found in DID document: ${kid}`);
    }

    return this.updateIdentifier(
      {
        did: identifier.did,
        document: {
          verificationMethod: filteredVMs,
        },
      },
      context,
    );
  }

  /**
   * Adds a service endpoint to the DID document.
   */
  async addService(
    { identifier, service, options }: { identifier: IIdentifier; service: IService; options?: any },
    context: WebvhProviderContext,
  ): Promise<any> {
    const scid = WebvhDidLogStore.extractScid(identifier.did);
    const logEntity = await this.logStore.getByScid(scid);
    if (!logEntity) {
      throw new Error(`did:webvh DID not found: ${identifier.did}`);
    }

    const existingLog = JSON.parse(logEntity.log);
    const currentDoc = existingLog[existingLog.length - 1]?.state;
    const currentServices = currentDoc?.service || [];

    return this.updateIdentifier(
      {
        did: identifier.did,
        document: {
          service: [
            ...currentServices,
            {
              id: service.id,
              type: service.type,
              serviceEndpoint: service.serviceEndpoint,
            },
          ],
        },
      },
      context,
    );
  }

  /**
   * Removes a service endpoint from the DID document.
   */
  async removeService(
    { identifier, id, options }: { identifier: IIdentifier; id: string; options?: any },
    context: WebvhProviderContext,
  ): Promise<any> {
    const scid = WebvhDidLogStore.extractScid(identifier.did);
    const logEntity = await this.logStore.getByScid(scid);
    if (!logEntity) {
      throw new Error(`did:webvh DID not found: ${identifier.did}`);
    }

    const existingLog = JSON.parse(logEntity.log);
    const currentDoc = existingLog[existingLog.length - 1]?.state;
    const currentServices = currentDoc?.service || [];

    const filteredServices = currentServices.filter(
      (svc: any) => svc.id !== id,
    );

    if (filteredServices.length === currentServices.length) {
      throw new Error(`Service not found in DID document: ${id}`);
    }

    return this.updateIdentifier(
      {
        did: identifier.did,
        document: {
          service: filteredServices,
        },
      },
      context,
    );
  }
}
