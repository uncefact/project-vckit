import {
  RevocationData,
  RevocationList,
} from './entities/revocation-list-2020-data.js';

export { RevocationDataStore } from './identifier/revocation-list-2020-store.js';
export { RevocationStatus2020 } from './revocation-list-2020.js';
export { migrations } from './migrations/index.js';
export { revocationList2020 } from './revocation-list-2020-middleware.js';
export { revocationList2020Router } from './revocation-list-2020-router.js';

export const Entities = [RevocationData, RevocationList];
