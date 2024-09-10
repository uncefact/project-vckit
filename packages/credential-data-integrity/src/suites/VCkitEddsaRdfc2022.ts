import {
  bytesToBase64,
  hexToBytes,
  base64ToBytes,
  bytesToBase58,
} from '@veramo/utils';
import { VeramoLdSignature } from '@veramo/credential-ld';
import {
  CredentialPayload,
  IAgentContext,
  DIDDocument,
  DIDDocComponent,
  IKey,
  TKeyType,
  IResolver,
  IKeyManager,
} from '@vckit/core-types';
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { cryptosuite as eddsaRdfc2022CryptoSuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';

/**
 * VCKit wrapper for the Ed25519Multikey suite by @digitalbazaar
 */
export class VCkitEddsaRdfc2022 extends VeramoLdSignature {
  /**
   * This method is called when create a suite's verification key.
   * @returns the supported verification type (Multikey)
   */
  getSupportedVerificationType(): string {
    return 'Multikey';
  }

  /**
   * This method is called in the custom signer object in the suite.
   * @returns the supported Veramo key type (Ed25519)
   */
  getSupportedVeramoKeyType(): TKeyType {
    return 'Ed25519';
  }

  /**
   * This method is called before the credential is signed.
   * If you need to modify the suite before signing, you can do it here.
   * @param key is the Cryptographic key to be used for signing
   * @param issuerDid is the DID of the issuer
   * @param verificationMethodId is the ID of the verification method
   * @param context is the agent context
   * @returns the suite for signing
   */
  async getSuiteForSigning(
    key: IKey,
    issuerDid: string,
    verificationMethodId: string,
    context: IAgentContext<IResolver & Pick<IKeyManager, 'keyManagerSign'>>,
  ) {
    // Custom signer for the suite
    const signer = {
      // Required for the DataIntegrityProof
      id: verificationMethodId,
      // Required for the DataIntegrityProof
      algorithm: this.getSupportedVeramoKeyType(), // Ed25519
      sign: async (args: { data: Uint8Array }): Promise<Uint8Array> => {
        const messageString = bytesToBase64(args.data);
        const signature = await context.agent.keyManagerSign({
          keyRef: key.kid,
          data: messageString,
          encoding: 'base64',
        });
        return base64ToBytes(signature);
      },
    };

    /**
     * The public key multibase must consist of a binary value that starts with the two-byte prefix '0xed01'
     * For details see: https://www.w3.org/TR/vc-di-eddsa/#multikey
     */
    const MULTICODEC_PUB_HEADER = new Uint8Array([0xed, 0x01]);
    const publicKeyMultibase = `z${bytesToBase58(new Uint8Array([...MULTICODEC_PUB_HEADER, ...hexToBytes(key.publicKeyHex)]))}`;

    const verificationKey = await Ed25519Multikey.from({
      id: verificationMethodId,
      controller: issuerDid,
      type: this.getSupportedVerificationType(), // Multikey
      publicKeyMultibase,
    });

    // overwrite the signer since we're not passing the private key
    verificationKey.signer = () => signer;

    const suite = new DataIntegrityProof({
      key: verificationKey, // use Ed25519Multikey suite for signing
      signer,
      cryptosuite: eddsaRdfc2022CryptoSuite,
    });

    suite.ensureSuiteContext = ({
      document,
    }: {
      document: any;
      addSuiteContext: boolean;
    }) => {
      // necessary context for the suite
      const credentialContextUrls = new Set([
        'https://w3id.org/security/multikey/v1',
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/ns/credentials/v2',
        'https://w3id.org/security/data-integrity/v1',
        'https://w3id.org/security/data-integrity/v2',
      ]);
      const firstContext = Array.isArray(document['@context'])
        ? document['@context'][0]
        : document['@context'];
      if (!credentialContextUrls.has(firstContext)) {
        throw new TypeError(
          "The document to be signed must contain this suite's @context, " +
            `${JSON.stringify(document['@context'], null, 2)}.`,
        );
      }
    };

    return suite;
  }

  /**
   * This method is called before verifying the credential.
   * If you need to change the suite before verifying, you can do it here.
   * @returns the suite for verification
   */
  getSuiteForVerification() {
    // type of the suite is DataIntegrityProof
    return new DataIntegrityProof({ cryptosuite: eddsaRdfc2022CryptoSuite });
  }

  /**
   * This method is called before the credential is signed.
   * If you need to modify the credential before signing, you can do it here.
   * @param credential is the credential to be signed
   */
  preSigningCredModification(credential: CredentialPayload) {}

  /**
   * This method is called before the DID resolution.
   * If you need to modify the DID Document before resolving, you can do it here.
   * @param didUrl is the DID URL of the DID Document
   * @param didDoc is the DID Document
   * @param context is the agent context
   * @returns the DID Document or the DID Component (e.g. Verification Method)
   */
  async preDidResolutionModification(
    didUrl: string,
    didDoc: DIDDocument,
    context: IAgentContext<IResolver>,
  ): Promise<DIDDocument | DIDDocComponent> {
    // Check if the DID Document has Multikey verification method
    const supportedVerificationType = this.getSupportedVerificationType(); // Multikey
    const hasMultikey = didDoc?.verificationMethod?.some(vm => vm.type === supportedVerificationType);
    const isOldVerificationMethodType = didUrl.match(/-key-[0-9]$/);

    // If not have Multikey verification method, return the DID Document
    // or if the didUrl does not contain controllerKeyID, return the DID Document
    if (!hasMultikey || isOldVerificationMethodType || !didUrl.includes('#') || didUrl === didDoc.id) {
      return didDoc;
    }

    // Get the DID component by controllerKeyID (e.g. didUrl is 'did:example:123#controllerKeyID')
    const didComponent: any = await context.agent.getDIDComponentById({ didDocument: didDoc, didUrl });
    if (!didComponent) {
      throw new Error(`DID component not found. The document loader could not locate DID component by fragment: ${didUrl}.`);
    }

    // return the DID component (Verification Method)
    didComponent['@context'] = didDoc['@context'];
    return didComponent;
  }
}
