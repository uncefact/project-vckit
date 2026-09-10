import { AddWebvhUpdateKeyRefs1700000000002 } from './2.addUpdateKeyRefs.js';
import { CreateWebvhDidLogTable1700000000001 } from './1.createWebvhDidLogTable.js';

/**
 * The migrations array that SHOULD be used when initializing a TypeORM database connection
 * for the did:webvh plugin.
 *
 * @public
 */
export const migrations = [CreateWebvhDidLogTable1700000000001, AddWebvhUpdateKeyRefs1700000000002];
