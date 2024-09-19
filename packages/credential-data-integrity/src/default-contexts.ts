import contextCredentialV1 from './contexts/www.w3.org_2018_credentials_v1.json' assert { type: 'json' }
import contextCredentialV2 from './contexts/www.w3.org_ns_credentials_v2.json' assert { type: 'json' }
import contextDidV1 from './contexts/www.w3.org_ns_did_v1.json' assert { type: 'json' }
import contextMultikey from './contexts/w3id.org_security_multikey_v1.json' assert { type: 'json' }
import contextDataIntegrityV1 from './contexts/w3id.org_security_data-integrity_v1.json' assert { type: 'json' }
import contextDataIntegrityV2 from './contexts/w3id.org_security_data-integrity_v2.json' assert { type: 'json' }

// @ts-ignore
export const contexts = new Map([
  ['https://www.w3.org/2018/credentials/v1', contextCredentialV1],
  ['https://www.w3.org/ns/credentials/v2', contextCredentialV2],
  ['https://www.w3.org/ns/did/v1', contextDidV1],
  ['https://w3id.org/security/multikey/v1', contextMultikey],
  ['https://w3id.org/security/data-integrity/v1', contextDataIntegrityV1],
  ['https://w3id.org/security/data-integrity/v2', contextDataIntegrityV2],
])
