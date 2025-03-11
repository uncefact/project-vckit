import {
  CredentialPayload,
  IKey,
  IAgentContext,
  IKeyManager,
  IResolver,
  VerifiableCredential,
  ProofType,
  UnsignedCredential,
} from '@uncefact/vckit-core-types';
import * as vc from '@digitalcredentials/vc';
import { MDP2021SuiteLoader } from './mdp-2021-suite-loader.js';
import jsonldSignatures from '@digitalcredentials/jsonld-signatures';
import { MDP2021ContextLoader } from './mdp-2021-context-loader.js';
import pointer from 'json-pointer';
import Debug from 'debug';

const { extendContextLoader } = jsonldSignatures;
const debug = Debug('veramo:w3c:ld-credential-module');

const objectToMessages = (obj: any) => {
  const dict = pointer.dict(obj);
  const messages = Object.keys(dict).map((key) => {
    const messageObj: { [k: string]: any } = {};
    messageObj[key] = dict[key];
    return JSON.stringify(messageObj);
  });
  return messages;
};

const messagesToObject = (messages: string[]) => {
  const obj = {};
  messages
    .map((m) => {
      return JSON.parse(m);
    })
    .forEach((m) => {
      const [key] = Object.keys(m);
      const value = m[key];
      pointer.set(obj, key, value);
    });
  return obj;
};

const deriveProofOptions = {
  objectToMessages,
  messagesToObject,
};

const verifyProofOptions = {
  objectToMessages,
  messagesToObject,
};

export type RequiredAgentMethods = IResolver &
  Pick<IKeyManager, 'keyManagerGet' | 'keyManagerSign'>;

export class MerkleDisclosureProof2021Module {
  public static type = 'MerkleDisclosureProof2021';
  public normalization: string = 'naive';
  private rootNonce?: string;
  mdp2021SuiteLoader: MDP2021SuiteLoader;
  mdp2021ContextLoader: MDP2021ContextLoader;

  constructor(options: {
    mdp2021SuiteLoader: MDP2021SuiteLoader;
    mdp2021ContextLoader: MDP2021ContextLoader;
    normalization?: string;
    rootNonce?: string;
  }) {
    this.mdp2021SuiteLoader = options.mdp2021SuiteLoader;
    this.mdp2021ContextLoader = options.mdp2021ContextLoader;

    if (options) {
      this.rootNonce = options.rootNonce;
      const { normalization } = options;

      if (normalization) {
        this.normalization = normalization;
      }
    }
  }

  getDocumentLoader(
    context: IAgentContext<IResolver>,
    attemptToFetchContexts: boolean = false
  ) {
    return extendContextLoader(async (url: string) => {
      // did resolution
      if (url.toLowerCase().startsWith('did:')) {
        const resolutionResult = await context.agent.resolveDid({
          didUrl: url,
        });
        const didDoc = resolutionResult.didDocument;

        if (!didDoc) return;

        let result: any = didDoc;

        for (const x of this.mdp2021SuiteLoader.getAllSignatureSuites()) {
          result =
            (await x.preDidResolutionModification(url, result, context)) ||
            result;
        }

        return {
          contextUrl: null,
          documentUrl: url,
          document: result,
        };
      }

      if (this.mdp2021ContextLoader.has(url)) {
        const contextDoc = await this.mdp2021ContextLoader.get(url);
        return {
          contextUrl: null,
          documentUrl: url,
          document: contextDoc,
        };
      } else {
        if (attemptToFetchContexts) {
          // attempt to fetch the remote context!!!! MEGA FAIL for JSON-LD.
          debug('WARNING: attempting to fetch the doc directly for ', url);
          try {
            const response = await fetch(url);
            if (response.status === 200) {
              const document = await response.json();
              return {
                contextUrl: null,
                documentUrl: url,
                document,
              };
            }
          } catch (e) {
            debug(
              'WARNING: unable to fetch the doc or interpret it as JSON',
              e
            );
          }
        }
      }

      debug(
        `WARNING: Possible unknown context/identifier for ${url} \n falling back to default documentLoader`
      );

      return vc.defaultDocumentLoader(url);
    });
  }

  async issueMDP2021VerifiableCredential(
    credential: CredentialPayload,
    issuerDid: string,
    key: IKey,
    verificationMethodId: string,
    options: any,
    context: IAgentContext<RequiredAgentMethods>
  ): Promise<VerifiableCredential> {
    const suite = this.mdp2021SuiteLoader.getSignatureSuiteForKeyType(
      key.type,
      key.meta?.verificationMethod?.type ?? ''
    );
    const documentLoader = this.getDocumentLoader(
      context,
      options.fetchRemoteContexts
    );

    // some suites can modify the incoming credential (e.g. add required contexts)
    suite.preSigningCredModification(credential);

    return await vc.issue({
      ...options,
      credential,
      suite: await suite.getSuiteForSigning(
        key,
        issuerDid,
        verificationMethodId,
        context
      ),
      documentLoader,
      compactProof: false,
    });
  }

  async redactVerifiableCredential(
    inputVerifiableCredential: VerifiableCredential,
    outputCredential: CredentialPayload,
    issuerDid: string,
    verificationMethodId: string,
    key: IKey,
    context: IAgentContext<RequiredAgentMethods>
  ): Promise<VerifiableCredential> {
    const suite = this.mdp2021SuiteLoader.getSignatureSuiteForKeyType(
      key.type,
      key.meta?.verificationMethod?.type ?? ''
    );

    const suiteForSigning = await suite.getSuiteForSigning(
      key,
      issuerDid,
      verificationMethodId,
      context
    );

    const derived: { document: UnsignedCredential; proof: ProofType } =
      await suiteForSigning.deriveProof({
        ...deriveProofOptions,
        inputDocumentWithProof: inputVerifiableCredential,
        outputDocument: outputCredential,
      });
    return { ...derived.document, proof: derived.proof };
  }

  async verifyMDP2021VerifiableCredential(
    credential: VerifiableCredential,
    issuerDid: string,
    verificationMethodId: string,
    key: IKey,
    options: any,
    context: IAgentContext<RequiredAgentMethods>
  ): Promise<{
    verified: boolean;
    error?: any;
  }> {
    const documentLoader = this.getDocumentLoader(
      context,
      options.fetchRemoteContexts
    );

    const result = await vc.verifyCredential({
      ...options,
      credential,
      suite: this.mdp2021SuiteLoader.getAllSignatureSuites().map((x) => {
        return x.getSuiteForVerification();
      }),
      documentLoader,
      compactProof: false,
      checkStatus: async () => Promise.resolve({ verified: true }), // Fake method
    });

    return result;
  }
}
