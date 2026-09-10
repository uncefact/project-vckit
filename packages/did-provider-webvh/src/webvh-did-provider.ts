import { deriveNextKeyHash, resolveDIDFromLog } from 'didwebvh-ts';
import type { WebvhDidLog } from './entities/webvh-did-log.js';
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

  private multikey(key: IKey): string {
    if (key.type !== 'Ed25519') throw new Error('WebVH update keys must be Ed25519');
    return bytesToMultibase(hexToBytes(key.publicKeyHex), 'Ed25519');
  }

  private async managedKey(reference: string, refs: Record<string, string>, context: WebvhProviderContext): Promise<IKey> {
    const key = await context.agent.keyManagerGet({ kid: refs[reference] || reference });
    const multikey = this.multikey(key);
    if (reference.startsWith('z') && multikey !== reference) throw new Error('KMS key does not match the requested update multikey');
    return key;
  }

  private async signingKey(entity: WebvhDidLog, identifier: IIdentifier, context: WebvhProviderContext, requested?: string, authorizedKeys?: string[]): Promise<IKey> {
    const { meta } = await resolveDIDFromLog(JSON.parse(entity.log), { verifier: new VeramoVerifier() });
    const authorized = authorizedKeys ?? meta.updateKeys;
    const refs: Record<string, string> = JSON.parse(entity.updateKeyRefs || '{}');
    for (const key of identifier.keys) {
      if (key.type === 'Ed25519') refs[this.multikey(key)] = key.kid;
    }
    if (requested) {
      const key = await this.managedKey(requested, refs, context);
      if (!authorized.includes(this.multikey(key))) throw new Error('Signing key is not authorized to update this DID');
      return key;
    }
    for (const multikey of authorized) {
      if (refs[multikey]) return this.managedKey(multikey, refs, context);
    }
    throw new Error('No locally managed key is authorized to update this DID');
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

    if (options?.updateKeys?.length === 0) throw new Error('At least one update key is required at creation');
    const initialKeys = options?.updateKeys
      ? await Promise.all(options.updateKeys.map(ref => this.managedKey(ref, {}, context)))
      : [await context.agent.keyManagerCreate({ kms: keyManagementSystem, type: 'Ed25519' })];
    const key = options?.signingKey ? await this.managedKey(options.signingKey, {}, context) : initialKeys[0];
    if (!initialKeys.some(candidate => this.multikey(candidate) === this.multikey(key))) {
      throw new Error('Signing key is not authorized to create this DID');
    }
    const updateKeyRefs = Object.fromEntries(initialKeys.map(candidate => [this.multikey(candidate), candidate.kid]));

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
      updateKeys: initialKeys.map(candidate => this.multikey(candidate)),
      verificationMethods,
      portable,
      verifier: new VeramoVerifier(),
    };

    if (options?.paths) {
      createOptions.paths = options.paths;
    }

    if (options?.preRotation || options?.nextUpdateKeys) {
      const futureKeys = options?.nextUpdateKeys
        ? await Promise.all(options.nextUpdateKeys.map(ref => this.managedKey(ref, {}, context)))
        : [await context.agent.keyManagerCreate({ kms: keyManagementSystem, type: 'Ed25519' })];
      if (!futureKeys.length) throw new Error('Pre-rotation requires at least one future key');
      createOptions.nextKeyHashes = await Promise.all(futureKeys.map(key => deriveNextKeyHash(this.multikey(key))));
      for (const key of futureKeys) updateKeyRefs[this.multikey(key)] = key.kid;
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
      updateKeyRefs,
    });

    // 10. Build and return the Veramo IIdentifier
    const identifier: Omit<IIdentifier, 'provider'> = {
      did,
      controllerKeyId: key.kid,
      keys: initialKeys,
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
    const updateKeyRefs: Record<string, string> = JSON.parse(logEntity.updateKeyRefs || '{}');
    for (const key of identifier.keys) {
      if (key.type === 'Ed25519') updateKeyRefs[this.multikey(key)] = key.kid;
    }

    const { meta } = await resolveDIDFromLog(existingLog, { verifier: new VeramoVerifier() });
    let nextKeys = options?.updateKeys
      ? await Promise.all(options.updateKeys.map(ref => this.managedKey(ref, updateKeyRefs, context)))
      : undefined;
    if (meta.prerotation) {
      if (!nextKeys) {
        const committed = [];
        for (const multikey of Object.keys(updateKeyRefs)) {
          if (meta.nextKeyHashes.includes(await deriveNextKeyHash(multikey))) committed.push(multikey);
        }
        nextKeys = await Promise.all(committed.map(ref => this.managedKey(ref, updateKeyRefs, context)));
      }
      if (!nextKeys.length) throw new Error('No locally managed key matches the pre-rotation commitment');
      for (const key of nextKeys) {
        if (!meta.nextKeyHashes.includes(await deriveNextKeyHash(this.multikey(key)))) {
          throw new Error('Update key does not match the pre-rotation commitment');
        }
      }
    }
    const controllerKey = await this.signingKey(logEntity, identifier, context, options?.signingKey,
      meta.prerotation ? nextKeys!.map(key => this.multikey(key)) : undefined);
    if (options?.nextKeyHashes !== undefined && options.nextUpdateKeys !== undefined) {
      throw new Error('Specify nextUpdateKeys or nextKeyHashes, not both');
    }
    let nextKeyHashes = options?.nextKeyHashes;
    if (options?.nextUpdateKeys !== undefined) {
      const futureKeys = await Promise.all(options.nextUpdateKeys.map(ref => this.managedKey(ref, updateKeyRefs, context)));
      nextKeyHashes = await Promise.all(futureKeys.map(key => deriveNextKeyHash(this.multikey(key))));
      for (const key of futureKeys) updateKeyRefs[this.multikey(key)] = key.kid;
    }
    if (meta.prerotation && nextKeyHashes === undefined) {
      const futureKey = await context.agent.keyManagerCreate({ kms: controllerKey.kms, type: 'Ed25519' });
      const futureMultikey = this.multikey(futureKey);
      updateKeyRefs[futureMultikey] = futureKey.kid;
      nextKeyHashes = [await deriveNextKeyHash(futureMultikey)];
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
    if (nextKeys) {
      updateOptions.updateKeys = nextKeys.map(key => this.multikey(key));
      for (const key of nextKeys) updateKeyRefs[this.multikey(key)] = key.kid;
    }
    if (nextKeyHashes !== undefined) updateOptions.nextKeyHashes = nextKeyHashes;

    // Handle domain portability
    if (isPorting) {
      updateOptions.domain = options.portToDomain;
      if (options.portToPaths !== undefined) updateOptions.paths = options.portToPaths;
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
      updateKeyRefs,
      port: isPorting && newDid !== logEntity.currentDid
        ? { fromDid: logEntity.currentDid, toDid: newDid, controllerKeyId: controllerKey.kid }
        : undefined,
    });

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

    // Consume the committed key before deactivation: the dependency's deactivation
    // helper cannot perform a pre-rotation transition itself. Both entries remain durable.
    const { meta } = await resolveDIDFromLog(JSON.parse(logEntity.log), { verifier: new VeramoVerifier() });
    if (meta.prerotation) {
      await this.updateIdentifier({ did: identifier.did, document: {}, options: { nextKeyHashes: [] } }, context);
      return this.deleteIdentifier(identifier, context);
    }

    const existingLog = JSON.parse(logEntity.log);

    // Get the controller key for signing the deactivation entry
    const controllerKey = await this.signingKey(logEntity, identifier, context);

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
