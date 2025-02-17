import {
  IAgentContext,
  IAgentPlugin,
  ICreateVerifiableCredentialArgs,
  IIdentifier,
  IKey,
  IKeyManager,
  IOACredentialPlugin,
  IssuerAgentContext,
  IVerifyCredentialArgs,
  IVerifyResult,
  VerifiableCredential,
  VerifierAgentContext,
} from '@uncefact/vckit-core-types';

import {
  __unsafe__use__it__at__your__own__risks__wrapDocument,
  OpenAttestationDocument,
  utils,
  WrappedDocument,
} from '@govtechsg/open-attestation';

import {
  MANDATORY_CREDENTIAL_CONTEXT,
  processEntryToArray,
} from '@veramo/utils';

import schema from '@uncefact/vckit-core-types/build/plugin.schema.json' assert { type: 'json' };

import {
  isValid,
  openAttestationDidIdentityProof,
  openAttestationDidSignedDocumentStatus,
  openAttestationDnsDidIdentityProof,
  openAttestationDnsTxtIdentityProof,
  openAttestationHash,
  verificationBuilder,
  utils as oaVerifyUtils,
} from '@govtechsg/oa-verify';

const OA_MANDATORY_CREDENTIAL_CONTEXT =
  'https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json';

const OA_MANDATORY_CREDENTIAL_TYPES = 'VerifiableCredential';

/**
 
 * @public
 */
export class CredentialOA implements IAgentPlugin {
  readonly methods: IOACredentialPlugin;
  readonly schema = {
    components: {
      schemas: {
        ...schema.IOACredentialPlugin.components.schemas,
      },
      methods: {
        ...schema.IOACredentialPlugin.components.methods,
      },
    },
  };

  constructor() {
    this.methods = {
      createVerifiableCredentialOA:
        this.createVerifiableCredentialOA.bind(this),
      verifyCredentialOA: this.verifyCredentialOA.bind(this),
    };
  }

  /** {@inheritdoc @veramo/core-types#ICredentialIssuer.createVerifiableCredential} */
  async createVerifiableCredentialOA(
    args: ICreateVerifiableCredentialArgs,
    context: IssuerAgentContext
  ): Promise<VerifiableCredential> {
    const { credential: credentialInput, save } = args;

    const credentialContext = processEntryToArray(
      credentialInput['@context'],
      MANDATORY_CREDENTIAL_CONTEXT
    );

    const credentialType = processEntryToArray(
      credentialInput.type,
      OA_MANDATORY_CREDENTIAL_TYPES
    );

    const credential = {
      ...credentialInput,
      '@context': [
        ...new Set([...credentialContext, OA_MANDATORY_CREDENTIAL_CONTEXT]),
      ],
      type: credentialType,
    };

    let wrappedDocument: WrappedDocument<OpenAttestationDocument>;
    try {
      wrappedDocument =
        //@ts-ignore
        await __unsafe__use__it__at__your__own__risks__wrapDocument(credential);
    } catch (e) {
      throw new Error(
        `invalid_argument: credential is not a valid OpenAttestation document`
      );
    }

    const issuer = wrappedDocument.openAttestationMetadata.proof.value;

    let identifier: IIdentifier;
    try {
      identifier = await context.agent.didManagerGet({ did: issuer });
    } catch (e) {
      throw new Error(`invalid_argument: did not found in the DID manager`);
    }

    const key = identifier.keys.find((k) => k.type === 'Secp256k1');
    if (!key) {
      throw Error('No signing key for ' + identifier.did);
    }

    const signer = wrapSigner(context, key, 'eth_signMessage');

    const signature = await signer(`0x${wrappedDocument.proof.merkleRoot}`);

    const verifiableCredential: VerifiableCredential = {
      ...wrappedDocument,
      proof: {
        ...wrappedDocument.proof,
        key: `${identifier.did}#controller`,
        signature,
      },
    };

    if (save) {
      await context.agent.dataStoreSaveVerifiableCredential({
        verifiableCredential,
      });
    }

    return verifiableCredential;
  }

  /** {@inheritdoc @veramo/core-types#ICredentialVerifier.verifyCredential} */
  async verifyCredentialOA(
    args: IVerifyCredentialArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult> {
    try {
      const { credential } = args;

      if (!utils.isSignedWrappedV3Document(credential)) {
        throw new Error(
          'invalid_argument: credential must be a signed wrapped v3 document'
        );
      }

      const ethProvider = oaVerifyUtils.generateProvider({
        // TODO: remove hardcoded eth testnet config for OA verifier
        network: 'goerli',
      });

      const oaVerifiersToRun = [
        openAttestationHash,
        openAttestationDidSignedDocumentStatus,
        openAttestationDnsTxtIdentityProof,
        openAttestationDnsDidIdentityProof,
        openAttestationDidIdentityProof,
      ];

      const builtVerifier = verificationBuilder(oaVerifiersToRun, {
        provider: ethProvider,
      });
      const fragments = await builtVerifier(credential);

      const verified = isValid(fragments);
      const verificationResult = {
        verified,
        ...(verified && { verifiableCredential: credential }),
      };

      return verificationResult;
    } catch (error) {
      return {
        verified: false,
        error,
      };
    }
  }
}

const wrapSigner = (
  context: IAgentContext<Pick<IKeyManager, 'keyManagerSign'>>,
  key: IKey,
  algorithm?: string
) => {
  return (data: string | Uint8Array): Promise<string> =>
    context.agent.keyManagerSign({
      keyRef: key.kid,
      data: <string>data,
      algorithm,
      encoding: 'hex',
    });
};
