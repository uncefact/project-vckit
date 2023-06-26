export const RAW_OA_CREDENTIAL = {
  issuer: {
    id: 'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
    name: 'GoSource Pty Ltd',
    type: 'OpenAttestationIssuer',
  },
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json',
    'https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json',
    'https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json',
  ],
  type: [
    'VerifiableCredential',
    'OpenAttestationCredential',
    'DrivingLicenceCredential',
    'OpenAttestationCredential',
  ],
  issuanceDate: '2023-06-07T04:47:41.451Z',
  credentialSubject: {
    id: 'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
    name: 'Alice',
  },
  credentialStatus: {
    type: 'EthrStatusRegistry2019',
    id: 'goerli:0x97fd27892cdcD035dAe1fe71235c636044B59348',
  },
  openAttestationMetadata: {
    proof: {
      type: 'OpenAttestationProofMethod',
      method: 'DID',
      value:
        'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
      revocation: { type: 'NONE' },
    },
    identityProof: {
      type: 'DID',
      identifier:
        'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
    },
  },
};

export const INVALID_RAW_OA_CREDENTIAL = {
  issuer: {
    id: 'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
    name: 'GoSource Pty Ltd',
    type: 'OpenAttestationIssuer',
  },
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json',
    'https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json',
    'https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json',
  ],
  type: [
    'VerifiableCredential',
    'OpenAttestationCredential',
    'DrivingLicenceCredential',
    'OpenAttestationCredential',
  ],
  issuanceDate: '2023-06-07T04:47:41.451Z',
  credentialSubject: {
    id: 'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
    name: 'Alice',
  },
  credentialStatus: {
    type: 'EthrStatusRegistry2019',
    id: 'goerli:0x97fd27892cdcD035dAe1fe71235c636044B59348',
  },
};

export const SIGNED_WRAPPED_DOCUMENT = {
  version: 'https://schema.openattestation.com/3.0/schema.json',
  issuer: {
    id: 'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
    name: 'GoSource Pty Ltd',
    type: 'OpenAttestationIssuer',
  },
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json',
    'https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json',
    'https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json',
  ],
  type: [
    'VerifiableCredential',
    'OpenAttestationCredential',
    'DrivingLicenceCredential',
    'OpenAttestationCredential',
  ],
  issuanceDate: '2023-06-07T03:09:50.151Z',
  credentialSubject: {
    id: 'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
    name: 'Alice',
  },
  credentialStatus: {
    type: 'EthrStatusRegistry2019',
    id: 'goerli:0x97fd27892cdcD035dAe1fe71235c636044B59348',
  },
  openAttestationMetadata: {
    proof: {
      type: 'OpenAttestationProofMethod',
      method: 'DID',
      value:
        'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
      revocation: { type: 'NONE' },
    },
    identityProof: {
      type: 'DID',
      identifier:
        'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2',
    },
  },
  proof: {
    type: 'OpenAttestationMerkleProofSignature2018',
    proofPurpose: 'assertionMethod',
    targetHash:
      '39b632cd639d2648790a7a4b7e911557cefd497e95483fec503af5ac69179577',
    proofs: [],
    merkleRoot:
      '39b632cd639d2648790a7a4b7e911557cefd497e95483fec503af5ac69179577',
    salts:
      'W3sidmFsdWUiOiIwNjg1MThhNDBlYmZhYTM3NjFjNWJhNzYyNjczMTNkMTBmM2FhMmVmNWNiN2YzZDc0ZmY0MjI5Yjc4MDAyZDA2IiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiYTkzNmUwYTU1MWY2YWU5ZTgzM2ZmMGU2ZTJkNDY5ZTI3ZjU3MjljMTg4NDEyOGRlYzdjM2RhZGI2ODgzYTNjNCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMzUyZmQzNTdlZjFhNjZhODU1Mjk0MDM2YWIzYmE3NGM3YjU0Njg1MmM4M2JlMTFkYjNjYWFlMTgyMzM0N2Y2NyIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiI3MDdhNGViOTg0NGQ1YWY3NDQwOWJmOWRkOWZlOTkzMTBjZjI1NmQ1OTFmNjcwZjc5MGZlZTgxOGQ1M2I4NGRiIiwicGF0aCI6Imlzc3Vlci50eXBlIn0seyJ2YWx1ZSI6IjQ0YjBmZmQzNDJiMzNkNWFhNmQ4N2M4NDJhMTdhZDlhZDUxNGUzMGI0OTM4NjFhZjk5M2VmOTBhM2MwMWU4MWIiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiY2IzNmNiYTgyMjgxMzcyYWI3NjE4ODY1MmZhYzNjZTYxYTIzMWU3MDgzNGY4ZDJlYTRlOWM0MzBhZjAyYTkyNiIsInBhdGgiOiJAY29udGV4dFsxXSJ9LHsidmFsdWUiOiIxNDNmNWQyOWMyNDI5MGVlNGVjOGVkNDYyMmFiYzJiOGFmMjRmNTYyMjg5MTEwMGQzZmRmMjllNTQ2ZDhhZWZlIiwicGF0aCI6IkBjb250ZXh0WzJdIn0seyJ2YWx1ZSI6IjI0NDQ5N2QzOTk2MWU3MmJmNGIzZDliZGZmNmRhZjc3ZWJiZGJiZmYxZTM3NmQwM2RiOTk1NThmY2FmODgwYTciLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiODk4OTQzYTg5Y2ExMWM0MDM0ZmQyNGQxN2ExNzRmZWI4NTNiM2E5ODM3YWNhNmZiMTliM2U4Njc2Y2U0ZDI5OCIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImJlOGEyYjE0MmM0NGRlMTA4MGZiMTQzMjJhNDBkYzlhYzdmMjA4ZDAwNTI0NTRjOWNhYzEyYzE3YjVlYmRmOTciLCJwYXRoIjoidHlwZVsxXSJ9LHsidmFsdWUiOiIyMTZkNDIzOWJkYjQ3NTFmNjQzYTUxNWQxM2Q0YjgyNjAxZTY5ODU5ZjMwNzk3MjExODliZmZhNzY3ZjQ4N2ZmIiwicGF0aCI6InR5cGVbMl0ifSx7InZhbHVlIjoiZjVhNWI0MmZiZmE5YmQ0ZGUzOWI3N2MwZDRjMjY4MmE2OGI0MWExOTE4YjRjN2RhNTY5ZDUxZGM2MDYyZDY4NSIsInBhdGgiOiJ0eXBlWzNdIn0seyJ2YWx1ZSI6IjgwOTc0MTdiMzQ2ODkyZjYxZTJlOGI4ZWI0ZDVjOGI1YjZkMTI1ZjUxMmVmZGM4N2RmZTgwMTdiMTJjYTE0NDYiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImE0ZWU3ZWFiZTVhOWY5YTcxYzE3NTMzMWExNmFkOGU2ZTM3ZTY3ZjNkZGFlZjVjNTU0MTEzYWVmMzQzZTUyOTYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMzM2MDFiYWYzODlhOTkyZGIxMWFkZGU3ZmQ5M2U5Y2M1ZTI4ZWY2MmNkNGE5YTFlY2UxMmI0MDliMzQyZWJlOSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5uYW1lIn0seyJ2YWx1ZSI6IjU4MjNmYjdjOTFjYWYzYTkzNzcwNmFjYWMzOWQyYzFmZTJjZTZhM2QxNjA4ZWQ5ZWMxZWJmODJjODM5MDI4YzkiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy50eXBlIn0seyJ2YWx1ZSI6ImQ2MTZhNjQ2YmRlYzcwOWM1ODE0MWNjNzNiMmY1Yzc3YTIwZmNjMWUwZmExYWE5NDVkYjEwOTA1ZDkxN2VlN2UiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy5pZCJ9LHsidmFsdWUiOiI4NmY5YzM3NDBmY2Y0ZWYwYjgzNGZlZjg2MTZlYTg4ZGY4YjI1MzlkZWE3MzFmM2RjMWE3ZTBhMmRjMTZhZTgyIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnByb29mLnR5cGUifSx7InZhbHVlIjoiN2VhZjZiM2I1MTc4ZjIwYjRmMTZkZDdjNTA1NTgyMTM3NjY2YTkxYmUyMjAxZmJiNzc2YTQ0Njk2YjRjMTI0MyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi5tZXRob2QifSx7InZhbHVlIjoiYTA2ODQyYWRhOWU0OTBjOTc1NWZmNzVmMzIzZGZlYTk4ODNlZTgwMjM5NWY0ZjM0NWE1Mjg5ZWVjNGE1MzcxMSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi52YWx1ZSJ9LHsidmFsdWUiOiJkMTVlM2U3MjliYzk3YzVhYmE4MjVmYzUxMGE5N2JkNjE5YjZiZjcxMzQzMzFiNTQwY2UwODk4MDBiNjM0NTc0IiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnByb29mLnJldm9jYXRpb24udHlwZSJ9LHsidmFsdWUiOiJmYTNiZDFlM2Q3YTM1MmUwMDEyYzQwMmM2ODQxN2MwNDI1ZTc4OGYyNjQxYzBjZjRkZmM1ZDk2NzNiMWI0ZDFmIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLmlkZW50aXR5UHJvb2YudHlwZSJ9LHsidmFsdWUiOiJkY2JmMTQzN2Y1NGViZjg4NmVjNTU5YWU2OTQ5YTQ1YTAzYWY4NzRlNWJiYzQ2MjdiZmFlMTEyMjFiMTY1Y2I5IiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLmlkZW50aXR5UHJvb2YuaWRlbnRpZmllciJ9XQ==',
    privacy: { obfuscated: [] },
    key: 'did:ethr:0x02f6b75650805b93c9df9514e36302e8ad9ae1fbd8aeeb1163b7259dc2971dd3c2#controller',
    signature:
      '0xc1cf3aa8b11c638e37b3cc8d8df996f9f7fb618852ca7392adcbb4f4cbdfd9180eef177aa9b8dd468c1e6ee5a6c560ba9a9910bb10eb89c2dac1782939c2d25d1b',
  },
};
