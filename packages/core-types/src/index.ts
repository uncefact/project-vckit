/**
 * Provides {@link @vckit/core#Agent} implementation and defines {@link @vckit/core-types#IResolver},
 * {@link @vckit/core-types#IDIDManager}, {@link @vckit/core-types#IKeyManager}, {@link
 * @vckit/core-types#IDataStore}, {@link @vckit/core-types#IMessageHandler} plugin interfaces
 *
 * @packageDocumentation
 */
export { CoreEvents } from './coreEvents.js';
export * from './agent.js';
export * from './types/IAgent.js';
export * from './types/IOACredentialPlugin.js';
export * from './types/ICredentialPlugin.js';
export * from './types/ICredentialIssuer.js';
export * from './types/ICredentialVerifier.js';
export * from './types/ICredentialStatus.js';
export * from './types/ICredentialStatusManager.js';
export * from './types/ICredentialStatusVerifier.js';
export * from './types/IDataStore.js';
export * from './types/IDataStoreORM.js';
export * from './types/IIdentifier.js';
export * from './types/IDIDManager.js';
export * from './types/IKeyManager.js';
export * from './types/IMessage.js';
export * from './types/IMessageHandler.js';
export * from './types/IResolver.js';
export * from './types/IError.js';
export * from './types/IVerifyResult.js';
export * from './types/vc-data-model.js';
export * from './types/IQRCodeEndpoint.js';
export * from './types/IRender.js';
export * from './types/IRendererProvider.js';
export * from './types/IEncryptedStorage.js';
export * from './types/IRevocationList2020.js';
