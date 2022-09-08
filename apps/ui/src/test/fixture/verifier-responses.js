// Verification Responses

export const whenDocumentHashInvalidAndNotIssued = [
  {
    data: false,
    reason: {
      code: 0,
      codeString: "DOCUMENT_TAMPERED",
      message: "Certificate has been tampered with",
    },
    status: "INVALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    data: {
      details: [
        {
          address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53991",
          reason: {
            code: 2,
            codeString: "CONTRACT_ADDRESS_INVALID",
            message: "Contract address 0x20bc9C354A18C8178A713B9BcCFFaC2152b53991 is invalid",
          },
          issued: false,
        },
      ],
      issuedOnAll: false,
    },
    reason: {
      code: 2,
      codeString: "CONTRACT_ADDRESS_INVALID",
      message: "Contract address 0x20bc9C354A18C8178A713B9BcCFFaC2152b53991 is invalid",
    },
    status: "INVALID",
    name: "OpenAttestationEthereumDocumentStoreIssued",
    type: "DOCUMENT_STATUS",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          issued: false,
          reason: {
            code: 1,
            codeString: "DOCUMENT_NOT_ISSUED",
            message:
              "Certificate 0xda7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
        },
      ],
      issuedOnAll: false,
    },
    reason: {
      code: 1,
      codeString: "DOCUMENT_NOT_ISSUED",
      message:
        "Certificate 0xda7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
    },
    status: "INVALID",
  },
  {
    reason: {
      code: 2,
      codeString: "SKIPPED",
      message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`,
    },
    status: "SKIPPED",
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
  },
  {
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: `Document was not issued using DNS-DID`,
    },
    status: "SKIPPED",
    name: "OpenAttestationDnsDidIdentityProof",
    type: "ISSUER_IDENTITY",
  },
  {
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: `Document is not using DID as top level identifier`,
    },
    status: "SKIPPED",
    name: "OpenAttestationDidIdentityProof",
    type: "ISSUER_IDENTITY",
  },
];

export const whenDocumentNotIssued = [
  {
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          issued: false,
          reason: {
            code: 1,
            codeString: "DOCUMENT_NOT_ISSUED",
            message:
              "Certificate 0xda7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
        },
      ],
      issuedOnAll: false,
    },
    reason: {
      code: 1,
      codeString: "DOCUMENT_NOT_ISSUED",
      message:
        "Certificate 0xda7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
    },
    status: "INVALID",
  },
  {
    data: true,
    status: "VALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "example.tradetrust.io",
        value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
      },
    ],
    status: "VALID",
  },
];

export const whenDocumentValidAndIssuedByDns = [
  {
    data: true,
    status: "VALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    data: {
      issuedOnAll: true,
      revokedOnAny: false,
      details: {
        issuance: [
          {
            issued: true,
            address: "0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
          },
        ],
        revocation: [
          {
            revoked: false,
            address: "0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
          },
        ],
      },
    },
    status: "VALID",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "example.tradetrust.io",
        value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
      },
    ],
    status: "VALID",
  },
];

export const whenDocumentValidAndIssuedByDid = [
  {
    data: true,
    status: "VALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          issued: true,
        },
      ],
      issuedOnAll: true,
    },
    status: "VALID",
    name: "OpenAttestationEthereumDocumentStoreIssued",
    type: "DOCUMENT_STATUS",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          revoked: false,
        },
      ],
      revokedOnAny: false,
    },
    status: "VALID",
    name: "OpenAttestationEthereumDocumentStoreRevoked",
    type: "DOCUMENT_STATUS",
  },
  {
    name: "OpenAttestationDidIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        did: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      },
    ],
    status: "VALID",
  },
];

export const whenDocumentHashInvalid = [
  ...whenDocumentValidAndIssuedByDns.filter((fragment) => fragment.type !== "DOCUMENT_INTEGRITY"),
  {
    data: false,
    reason: {
      code: 0,
      codeString: "DOCUMENT_TAMPERED",
      message: "Certificate has been tampered with",
    },
    status: "INVALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
];

export const whenDocumentRevoked = [
  {
    type: "DOCUMENT_INTEGRITY",
    name: "OpenAttestationHash",
    data: true,
    status: "VALID",
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationEthereumTokenRegistryStatus",
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
  },
  {
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    data: {
      issuedOnAll: true,
      revokedOnAny: true,
      details: {
        issuance: [
          {
            issued: true,
            address: "0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
          },
        ],
        revocation: [
          {
            revoked: true,
            address: "0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
            reason: {
              message:
                "Document 0x1268951303ad546f18d00f26344b1841d4f6a4f432cec898308a3535ba7f9bdd has been revoked under contract 0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
              code: 5,
              codeString: "DOCUMENT_REVOKED",
            },
          },
        ],
      },
    },
    reason: {
      message:
        "Document 0x1268951303ad546f18d00f26344b1841d4f6a4f432cec898308a3535ba7f9bdd has been revoked under contract 0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
      code: 5,
      codeString: "DOCUMENT_REVOKED",
    },
    status: "INVALID",
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationDidSignedDocumentStatus",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document was not signed by DID directly",
    },
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "inc-brown-jaguar.sandbox.fyntech.io",
        value: "0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
      },
    ],
    status: "VALID",
  },
  {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "OpenAttestationDnsDidIdentityProof",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document was not issued using DNS-DID",
    },
  },
  {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "OpenAttestationDidIdentityProof",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document is not using DID as top level identifier or has not been wrapped",
    },
  },
];

export const whenDocumentIssuerIdentityInvalidDnsTxt = [
  {
    data: true,
    status: "VALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          issued: true,
        },
      ],
      issuedOnAll: true,
    },
    status: "VALID",
    name: "OpenAttestationEthereumDocumentStoreIssued",
    type: "DOCUMENT_STATUS",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          revoked: false,
        },
      ],
      revokedOnAny: false,
    },
    status: "VALID",
    name: "OpenAttestationEthereumDocumentStoreRevoked",
    type: "DOCUMENT_STATUS",
  },
  {
    reason: {
      code: 2,
      codeString: "SKIPPED",
      message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`,
    },
    status: "SKIPPED",
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
  },
];

export const whenDocumentIssuerIdentityInvalidDid = [
  {
    data: true,
    status: "VALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          issued: true,
        },
      ],
      issuedOnAll: true,
    },
    status: "VALID",
    name: "OpenAttestationEthereumDocumentStoreIssued",
    type: "DOCUMENT_STATUS",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          revoked: false,
        },
      ],
      revokedOnAny: false,
    },
    status: "VALID",
    name: "OpenAttestationEthereumDocumentStoreRevoked",
    type: "DOCUMENT_STATUS",
  },
  {
    reason: {
      code: 2,
      codeString: "SKIPPED",
      message: `Document is not using DID as top level identifier`,
    },
    status: "SKIPPED",
    name: "OpenAttestationDidIdentityProof",
    type: "ISSUER_IDENTITY",
  },
];

export const whenTransferableDocumentVerified = [
  { type: "DOCUMENT_INTEGRITY", name: "OpenAttestationHash", data: true, status: "VALID" },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationEthereumDocumentStoreIssued",
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
    },
  },
  {
    name: "OpenAttestationEthereumTokenRegistryMinted",
    type: "DOCUMENT_STATUS",
    data: { mintedOnAll: true, details: [{ minted: true, address: "0xc3E9eBc6aDA9BA4B4Ce65D71901Cb2307e9670cE" }] },
    status: "VALID",
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationEthereumDocumentStoreRevoked",
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
    },
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "demo-tradetrust.openattestation.com",
        value: "0xc3E9eBc6aDA9BA4B4Ce65D71901Cb2307e9670cE",
      },
    ],
    status: "VALID",
  },
];

export const whenDocumentInvalid = [
  {
    status: "SKIPPED",
    type: "DOCUMENT_INTEGRITY",
    name: "OpenAttestationHash",
    reason: {
      code: 2,
      codeString: "SKIPPED",
      message: "Document does not have merkle root, target hash or data.",
    },
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationEthereumTokenRegistryStatus",
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationEthereumDocumentStoreStatus",
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
    },
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationDidSignedDocumentStatus",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document was not signed by DID directly",
    },
  },
  {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "OpenAttestationDnsTxtIdentityProof",
    reason: {
      code: 2,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "documentStore" / "tokenRegistry" property or doesn\'t use DNS-TXT type',
    },
  },
  {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "OpenAttestationDnsDidIdentityProof",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document was not issued using DNS-DID",
    },
  },
  {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "OpenAttestationDidIdentityProof",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document is not using DID as top level identifier or has not been wrapped",
    },
  },
];

export const whenDocumentAddressInvalid = [
  {
    type: "DOCUMENT_INTEGRITY",
    name: "OpenAttestationHash",
    data: true,
    status: "VALID",
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationEthereumTokenRegistryStatus",
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
  },
  {
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    data: {
      issuedOnAll: true,
      revokedOnAny: true,
      details: {
        issuance: [
          {
            issued: true,
            address: "0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
          },
        ],
        revocation: [
          {
            revoked: true,
            address: "0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
            reason: {
              message: "Invalid document store address",
              code: 1,
              codeString: "DOCUMENT_STORE_ADDRESS_INVALID",
            },
          },
        ],
      },
    },
    reason: {
      code: 1,
      codeString: "DOCUMENT_STORE_ADDRESS_INVALID",
      message: "Invalid document store address",
    },
    status: "INVALID",
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationDidSignedDocumentStatus",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document was not signed by DID directly",
    },
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "inc-brown-jaguar.sandbox.fyntech.io",
        value: "0xF02F69B0c9F9Fc74110545E20a4A8CE7e0575fb4",
      },
    ],
    status: "VALID",
  },
  {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "OpenAttestationDnsDidIdentityProof",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document was not issued using DNS-DID",
    },
  },
  {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "OpenAttestationDidIdentityProof",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document is not using DID as top level identifier or has not been wrapped",
    },
  },
];

export const whenDocumentNotFound = [
  {
    data: true,
    status: "VALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          revoked: false,
        },
      ],
      revokedOnAny: false,
    },
    status: "INVALID",
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    reason: {
      code: 1,
      codeString: "1",
      message: "Contract is not found",
    },
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "example.tradetrust.io",
        value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
      },
    ],
    status: "VALID",
  },
];

export const whenInvalidCallArgument = [
  {
    data: true,
    status: "INVALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          revoked: false,
        },
      ],
      revokedOnAny: false,
    },
    status: "INVALID",
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    reason: {
      code: 1,
      codeString: "1",
      message: "Invalid call arguments",
    },
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "example.tradetrust.io",
        value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
      },
    ],
    status: "VALID",
  },
];

export const whenServerError = [
  {
    data: true,
    status: "VALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          revoked: false,
        },
      ],
      revokedOnAny: false,
    },
    status: "INVALID",
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    reason: {
      code: 500,
      codeString: "SERVER_ERROR",
      message: "Server error",
    },
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "example.tradetrust.io",
        value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
      },
    ],
    status: "VALID",
  },
];

export const whenUnhandledError = [
  {
    data: true,
    status: "VALID",
    name: "OpenAttestationHash",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    name: "OpenAttestationEthereumTokenRegistryMinted",
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: {
      details: [
        {
          address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          revoked: false,
        },
      ],
      revokedOnAny: false,
    },
    status: "INVALID",
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    reason: {
      code: 3,
      codeString: "UNHANDLED_ERROR",
      message: "Unhandled error",
    },
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "example.tradetrust.io",
        value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
      },
    ],
    status: "VALID",
  },
];
