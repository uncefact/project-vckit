import { WebvhDidLog } from './entities/webvh-did-log.js';

// Provider
export { WebvhDIDProvider } from './webvh-did-provider.js';

// Resolver
export { getWebvhResolver, getWebvhLocalResolver } from './webvh-did-resolver.js';

// Express router for serving DID documents
export { WebvhDidDocRouter } from './webvh-did-doc-router.js';
export type { WebvhDidDocRouterOptions } from './webvh-did-doc-router.js';

// Signer adapter
export { VeramoSigner, VeramoVerifier } from './veramo-signer.js';

// Data store
export { WebvhDidLogStore } from './store/webvh-did-log-store.js';

// TypeORM entities (for DataSource configuration)
export const Entities = [WebvhDidLog];
export { WebvhDidLog } from './entities/webvh-did-log.js';

// Migrations (for DataSource configuration)
export { migrations } from './migrations/index.js';

// Types
export type {
  WebvhDIDProviderOptions,
  WebvhCreateIdentifierOptions,
  WebvhUpdateIdentifierOptions,
  WebvhDidMetadata,
  WebvhProviderContext,
} from './types.js';

// Combined configuration for the shared Veramo/WebVH database used by portability.
import { Entities as VeramoEntities, migrations as VeramoMigrations } from '@veramo/data-store';
import { migrations as WebvhMigrations } from './migrations/index.js';
export const SharedEntities = [...VeramoEntities, WebvhDidLog];
export const SharedMigrations = [...VeramoMigrations, ...WebvhMigrations];
