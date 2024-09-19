import { CredentialEncryptedData } from './entities/credential-encrypted-data.js';
import { EncryptedData } from './entities/encrypted-data.js';

export { EncryptedDataStore } from './identifier/encrypted-data-store.js';
export { EncryptedStorage } from './encrypted-storage.js';
export { migrations } from './migrations/index.js';
export { encryptedStoreMiddleware } from './encrypted-store-middleware.js';
export { encryptedStoreRouter } from './encrypted-store-router.js';

export const Entities = [EncryptedData, CredentialEncryptedData];
