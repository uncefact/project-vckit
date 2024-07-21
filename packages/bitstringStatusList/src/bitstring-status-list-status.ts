import { StatusEntry } from 'credential-status';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key';
import { getResolver as webDidResolver } from 'web-did-resolver';
import { decodeJWT } from 'did-jwt';
import { contexts } from '@transmute/did-context/index.js';
import { DocumentLoader } from '@transmute/vc-status-rl-2020/dist/types';
import * as didKey from '@transmute/did-key.js';
import * as didWeb from '@transmute/did-web';
import {
  ICredentialRouter,
  IVerifiableCredentialJSONOrJWT,
  IssuerType,
  VerifiableCredential,
} from '@vckit/core-types';
import { decodeList } from '@digitalbazaar/vc-bitstring-status-list';
import {
  CredentialIssuerLD,
  LdDefaultContexts,
  VeramoEcdsaSecp256k1RecoverySignature2020,
  VeramoEd25519Signature2018,
  VeramoJsonWebSignature2020,
} from '@veramo/credential-ld';
import { createAgent } from '@veramo/core';
import { CredentialRouter } from '@vckit/credential-router';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { VCkitEddsaRdfc2022 } from '@vckit/credential-data-integrity';

const resolve = async (did: string) => {
  if (did.startsWith('did:key')) {
    const { didDocument } = await didKey.resolve(did.split('#')[0], {
      accept: 'application/did+json',
    });
    return didDocument;
  }
  if (did.startsWith('did:web')) {
    return didWeb.resolve(did);
  }
  throw new Error('Unsupported did method');
};

const documentLoader: DocumentLoader = async (iri: string) => {
  if (iri) {
    if (contexts.get(iri)) {
      return { documentUrl: iri, document: contexts.get(iri) };
    }

    if (LdDefaultContexts.get(iri)) {
      return { documentUrl: iri, document: LdDefaultContexts.get(iri) };
    }

    if (iri.startsWith('did:')) {
      const didDocument = await resolve(iri);
      return { documentUrl: iri, document: didDocument };
    }

    if (iri.startsWith('http')) {
      const document = await fetch(iri).then((res) => res.json());
      return { documentUrl: iri, document };
    }
  }

  const message = 'Unsupported iri: ' + iri;
  throw new Error(message);
};

/**
 * @public
 *
 */
export async function checkStatus(credential: IVerifiableCredentialJSONOrJWT) {
  let statusEntry: StatusEntry[] | StatusEntry | undefined = undefined;
  let issuer: IssuerType | undefined = undefined;

  if (typeof credential === 'string') {
    ({ statusEntry, issuer } = _getStatusEntryAndIssuerFromJWT(credential));
  } else {
    statusEntry = credential.credentialStatus;
    issuer = credential.issuer;
  }

  if (!statusEntry) {
    return {
      revoked: false,
      message:
        'credentialStatus property was not set on the original credential',
    };
  }
  _validateStatusEntry(statusEntry);

  let statusEntryArray: StatusEntry[];
  if (!Array.isArray(statusEntry)) {
    statusEntryArray = [statusEntry];
  } else {
    statusEntryArray = statusEntry;
  }

  return _checkStatuses(issuer, statusEntryArray);
}

const _getStatusEntryAndIssuerFromJWT = (credential: string) => {
  let statusEntry: StatusEntry | undefined = undefined;
  let issuer: IssuerType | undefined = undefined;
  try {
    const decoded = decodeJWT(credential);
    statusEntry =
      decoded?.payload?.vc?.credentialStatus || // JWT Verifiable Credential payload
      decoded?.payload?.vp?.credentialStatus || // JWT Verifiable Presentation payload
      decoded?.payload?.credentialStatus; // legacy JWT payload
    issuer =
      decoded?.payload?.vc?.issuer || // JWT Verifiable Credential payload
      decoded?.payload?.vp?.issuer || // JWT Verifiable Presentation payload
      decoded?.payload?.issuer; // legacy JWT payload
  } catch (e1: unknown) {
    // not a JWT credential or presentation
    try {
      const decoded = JSON.parse(credential);
      statusEntry = decoded?.credentialStatus;
      issuer = decoded?.issuer;
    } catch (e2: unknown) {
      // not a JSON either.
    }
  }

  return { statusEntry, issuer };
};

const _validateStatusEntry = (statusEntry: StatusEntry | StatusEntry[]) => {
  if (
    !(
      typeof statusEntry === 'object' &&
      (statusEntry as any).type === 'BitstringStatusListEntry'
    ) &&
    !(
      Array.isArray(statusEntry) &&
      statusEntry.length > 0 &&
      statusEntry.every((entry) => entry?.type === 'BitstringStatusListEntry')
    )
  ) {
    throw new Error(
      'bad_request: credentialStatus entry is not formatted correctly. Validity can not be determined.',
    );
  }
};

const _checkStatuses = async (
  issuer: IssuerType | undefined,
  statusEntryArray: StatusEntry[],
) => {
  const defaultResult: {
    revoked: boolean;
    errors: { id: string; message: string }[];
  } = {
    revoked: false,
    errors: [],
  };

  const statuses = await Promise.all(
    statusEntryArray.map(async (statusEntry) =>
      _checkStatus(issuer, statusEntry),
    ),
  );
  return statuses.reduce((result, status) => {
    if (status.revoked) {
      result.revoked = true;
      result.errors = [...(result.errors || []), ...(status.errors || [])];
    }
    return result;
  }, defaultResult);
};

const verifyBitstringStatusListCredential = (
  credential: VerifiableCredential,
) => {
  const agent = createAgent<ICredentialRouter>({
    plugins: [
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...webDidResolver(),
          ...getDidKeyResolver(),
        }),
      }),
      new CredentialRouter(),
      new CredentialPlugin(),
      new CredentialIssuerLD({
        contextMaps: [LdDefaultContexts],
        suites: [
          new VeramoEd25519Signature2018(),
          new VeramoJsonWebSignature2020(),
          new VeramoEcdsaSecp256k1RecoverySignature2020(),
          new VCkitEddsaRdfc2022(),
        ],
      }),
    ],
  });
  return agent.routeVerificationCredential({
    credential,
    fetchRemoteContexts: true,
  });
};

const _checkStatus = async (
  issuer: IssuerType | undefined,
  statusEntry: StatusEntry,
) => {
  // get SL position
  const { statusListIndex } = statusEntry;
  const index = parseInt(statusListIndex, 10);
  // retrieve SL VC
  let slCredential: VerifiableCredential;
  try {
    const { document } = await documentLoader(statusEntry.statusListCredential);
    slCredential = document as VerifiableCredential;
  } catch (e) {
    return {
      revoked: true,
      errors: [
        {
          id: statusEntry.id,
          message:
            'Could not load "BitstringStatusListCredential"; ' +
            `reason: ${e.message}`,
        },
      ],
    };
  }

  const { statusPurpose: credentialStatusPurpose } = statusEntry;
  const { statusPurpose: slCredentialStatusPurpose } =
    slCredential.credentialSubject;
  if (slCredentialStatusPurpose !== credentialStatusPurpose) {
    return {
      revoked: true,
      errors: [
        {
          id: statusEntry.id,
          message:
            'The status purpose of the credential does not match the status purpose of the status list credential.',
        },
      ],
    };
  }

  // verify SL VC
  const verifyResult = await verifyBitstringStatusListCredential(slCredential);
  if (verifyResult.verified) {
    // ensure that the issuer of the verifiable credential matches
    // the issuer of the statusListCredential

    const credentialIssuer = typeof issuer === 'object' ? issuer.id : issuer;
    const statusListCredentialIssuer =
      typeof slCredential.issuer === 'object'
        ? slCredential.issuer.id
        : slCredential.issuer;

    if (
      !(credentialIssuer && statusListCredentialIssuer) ||
      credentialIssuer !== statusListCredentialIssuer
    ) {
      return {
        revoked: true,
        errors: [
          {
            id: statusEntry.id,
            message:
              'The issuer of the credential does not match the issuer of the status list credential.',
          },
        ],
      };
    }

    // get JSON BitstringStatusList
    const { credentialSubject: sl } = slCredential;

    // decode list from SL VC
    const { encodedList } = sl;
    const list = await decodeList({ encodedList });

    return { revoked: list.getStatus(index) };
  } else {
    return {
      revoked: true,
      errors: [
        {
          id: statusEntry.id,
          message: verifyResult.error?.message || 'Unknown error',
        },
      ],
    };
  }
};
