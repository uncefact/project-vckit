import {
  CredentialPayload,
  IAgentContext,
  IAgentPlugin,
  ICredentialStatusVerifier,
  IIdentifier,
  IResolver,
  IVerifyResult,
  VerifiableCredential,
} from '@uncefact/vckit-core-types';

import {
  _ExtendedIKey,
  extractIssuer,
  MANDATORY_CREDENTIAL_CONTEXT,
  mapIdentifierKeysToDoc,
  OrPromise,
  processEntryToArray,
  RecordLike,
} from '@veramo/utils';
import Debug from 'debug';
import schema from './plugin.schema.json' assert { type: 'json' };

import { MerkleDisclosureProof2021Module } from './merkle-disclosure-proof2021-module.js';
import { MDP2021ContextLoader } from './mdp-2021-context-loader.js';
import { MDP2021SuiteLoader } from './mdp-2021-suite-loader.js';
import { VeramoLdSignature } from '@veramo/credential-ld';
import {
  ICreateVerifiableCredentialMDPArgs,
  IRequiredContext,
  ContextDoc,
  ICredentialIssuerMDP,
  IRedactVerifiableCredentialArgs,
  IVerifyCredentialMDPArgs,
} from './types.js';

const debug = Debug('vckit:credential-mdp:action-handler');

/**

 * @public
 */
export class CredentialMerkleDisclosureProof implements IAgentPlugin {
  readonly methods: ICredentialIssuerMDP;
  readonly schema = schema.ICredentialIssuerMDP;

  private merkleDisclosureProof2021Module: MerkleDisclosureProof2021Module;

  constructor(options: {
    contextMaps: RecordLike<OrPromise<ContextDoc>>[];
    suites: VeramoLdSignature[];
  }) {
    this.merkleDisclosureProof2021Module = new MerkleDisclosureProof2021Module({
      mdp2021ContextLoader: new MDP2021ContextLoader({
        contextsPaths: options.contextMaps,
      }),
      mdp2021SuiteLoader: new MDP2021SuiteLoader({
        signatures: options.suites,
      }),
    });

    this.methods = {
      createVerifiableCredentialMDP:
        this.createVerifiableCredentialMDP.bind(this),
      redactVerifiableCredential: this.redactVerifiableCredential.bind(this),
      verifyCredentialMDP: this.verifyCredentialMDP.bind(this),
    };
  }

  public async createVerifiableCredentialMDP(
    args: ICreateVerifiableCredentialMDPArgs,
    context: IRequiredContext
  ): Promise<VerifiableCredential> {
    const credentialContext = processEntryToArray(
      args?.credential?.['@context'],
      MANDATORY_CREDENTIAL_CONTEXT
    );
    const credentialType = processEntryToArray(
      args?.credential?.type,
      'VerifiableCredential'
    );
    const credential: CredentialPayload = {
      ...args?.credential,
      '@context': credentialContext,
      type: credentialType,
    };

    credential.issuanceDate = new Date().toISOString();

    const issuer = extractIssuer(credential);
    if (!issuer || typeof issuer === 'undefined') {
      throw new Error(
        'invalid_argument: args.credential.issuer must not be empty'
      );
    }

    let identifier: IIdentifier;
    try {
      identifier = await context.agent.didManagerGet({ did: issuer });
    } catch (e) {
      throw new Error(
        `invalid_argument: args.credential.issuer must be a DID managed by this agent. ${e}`
      );
    }
    try {
      const { signingKey, verificationMethodId } =
        await this.findSigningKeyWithId(context, identifier, args.keyRef);

      let { now } = args;
      if (typeof now === 'number') {
        now = new Date(now * 1000);
      }

      const verifiableCredential =
        await this.merkleDisclosureProof2021Module.issueMDP2021VerifiableCredential(
          credential,
          identifier.did,
          signingKey,
          verificationMethodId,
          { ...args, now },
          context
        );

      if (args.save) {
        await context.agent.dataStoreSaveVerifiableCredential({
          verifiableCredential,
        });
      }
      return verifiableCredential;
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  }

  public async redactVerifiableCredential(
    args: IRedactVerifiableCredentialArgs,
    context: IRequiredContext
  ): Promise<VerifiableCredential> {
    const issuer = extractIssuer(args.inputVerifiableCredential);
    if (!issuer || typeof issuer === 'undefined') {
      throw new Error(
        'invalid_argument: args.inputVerifiableCredential.issuer must not be empty'
      );
    }

    let identifier: IIdentifier;
    try {
      identifier = await context.agent.didManagerGet({ did: issuer });
    } catch (e) {
      throw new Error(
        `invalid_argument: args.inputVerifiableCredential.issuer must be a DID managed by this agent. ${e}`
      );
    }
    const { signingKey, verificationMethodId } =
      await this.findSigningKeyWithId(context, identifier, args.keyRef);

    const verifiableCredential =
      await this.merkleDisclosureProof2021Module.redactVerifiableCredential(
        args.inputVerifiableCredential,
        args.outputCredential,
        identifier.did,
        verificationMethodId,
        signingKey,
        context
      );

    if (args.save) {
      await context.agent.dataStoreSaveVerifiableCredential({
        verifiableCredential,
      });
    }

    return verifiableCredential;
  }

  public async verifyCredentialMDP(
    args: IVerifyCredentialMDPArgs,
    context: IRequiredContext
  ): Promise<IVerifyResult> {
    const { credential, policies } = args;

    const issuer = extractIssuer(credential);
    if (!issuer || typeof issuer === 'undefined') {
      throw new Error(
        'invalid_argument: args.credential.issuer must not be empty'
      );
    }

    let identifier: IIdentifier;
    try {
      identifier = await context.agent.didManagerGet({ did: issuer });
    } catch (e) {
      throw new Error(
        `invalid_argument: args.credential.issuer must be a DID managed by this agent. ${e}`
      );
    }

    try {
      const { signingKey, verificationMethodId } =
        await this.findSigningKeyWithId(context, identifier, args.keyRef);

      const result =
        await this.merkleDisclosureProof2021Module.verifyMDP2021VerifiableCredential(
          credential,
          identifier.did,
          verificationMethodId,
          signingKey,
          { ...args },
          context
        );

      let verificationResult = {
        ...result,
        ...(result.verified && { verifiableCredential: credential }),
      };

      if (
        policies?.credentialStatus !== false &&
        (await isRevoked(credential, context as any))
      ) {
        verificationResult = {
          verified: false,
          error: {
            message: 'revoked: The credential was revoked by the issuer',
            errorCode: 'revoked',
          },
        };
      }
      return verificationResult;
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  }

  private async findSigningKeyWithId(
    context: IAgentContext<IResolver>,
    identifier: IIdentifier,
    keyRef?: string
  ): Promise<{ signingKey: _ExtendedIKey; verificationMethodId: string }> {
    const extendedKeys: _ExtendedIKey[] = await mapIdentifierKeysToDoc(
      identifier,
      'assertionMethod',
      context
    );
    let supportedTypes =
      this.merkleDisclosureProof2021Module.mdp2021SuiteLoader.getAllSignatureSuiteTypes();
    let signingKey: _ExtendedIKey | undefined;
    let verificationMethodId: string;
    if (keyRef) {
      signingKey = extendedKeys.find((k) => k.kid === keyRef);
    }
    if (
      signingKey &&
      !supportedTypes.includes(signingKey.meta.verificationMethod.type)
    ) {
      debug(
        'WARNING: requested signing key DOES NOT correspond to a supported Signature suite type. Looking for the next best key.'
      );
      signingKey = undefined;
    }
    if (!signingKey) {
      if (keyRef) {
        debug(
          'WARNING: no signing key was found that matches the reference provided. Searching for the first available signing key.'
        );
      }
      signingKey = extendedKeys.find((k) =>
        supportedTypes.includes(k.meta.verificationMethod.type)
      );
    }

    if (!signingKey)
      throw Error(
        `key_not_found: No suitable signing key found for ${identifier.did}`
      );
    verificationMethodId = signingKey.meta.verificationMethod.id;
    return { signingKey, verificationMethodId };
  }
}

async function isRevoked(
  credential: VerifiableCredential,
  context: IAgentContext<ICredentialStatusVerifier>
): Promise<boolean> {
  if (!credential.credentialStatus) return false;

  if (typeof context.agent.checkCredentialStatus === 'function') {
    const status = await context.agent.checkCredentialStatus({ credential });
    return status?.revoked == true || status?.verified === false;
  }

  throw new Error(
    `invalid_setup: The credential status can't be verified because there is no ICredentialStatusVerifier plugin installed.`
  );
}
