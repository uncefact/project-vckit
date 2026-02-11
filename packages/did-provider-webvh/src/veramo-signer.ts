import { IAgentContext, IKeyManager } from '@uncefact/vckit-core-types';

/**
 * Bridges Veramo's IKeyManager to the didwebvh-ts Signer interface.
 *
 * didwebvh-ts expects a Signer with:
 *   - sign(input: { document: any; proof: any }): Promise<{ proofValue: string }>
 *   - getVerificationMethodId(): string
 *
 * This adapter delegates raw Ed25519 signing to Veramo's keyManagerSign(),
 * while the didwebvh-ts library handles JCS canonicalization and proof
 * envelope construction via createDocumentSigner().
 *
 * @public
 */
export class VeramoSigner {
  private kid: string;
  private verificationMethodId: string;
  private context: IAgentContext<IKeyManager>;

  /**
   * @param kid - The Veramo key ID (from IKey.kid) used for signing
   * @param verificationMethodId - The DID URL for the verification method
   *   (e.g. 'did:key:z6Mkh...#z6Mkh...' or will be set to did:key form of the public key)
   * @param context - Veramo agent context with IKeyManager
   */
  constructor(
    kid: string,
    verificationMethodId: string,
    context: IAgentContext<IKeyManager>,
  ) {
    this.kid = kid;
    this.verificationMethodId = verificationMethodId;
    this.context = context;
  }

  /**
   * Returns the verification method ID used in Data Integrity proofs.
   */
  getVerificationMethodId(): string {
    return this.verificationMethodId;
  }

  /**
   * Signs data using Veramo's key manager.
   *
   * didwebvh-ts's createDocumentSigner() calls this method after it has
   * prepared the data for signing (JCS canonicalization + hashing).
   * We receive the serialized bytes and produce an Ed25519 signature.
   *
   * @param input - The signing input from didwebvh-ts
   * @param input.document - The canonicalized document to sign
   * @param input.proof - The proof options (type, verificationMethod, etc.)
   * @returns The proofValue as a base58btc-encoded multibase string
   */
  async sign(input: {
    document: any;
    proof: any;
  }): Promise<{ proofValue: string }> {
    // didwebvh-ts prepareDataForSigning handles JCS + hashing.
    // We need to serialize the combined document+proof for signing.
    // The actual signing flow is:
    //   1. didwebvh-ts calls createDocumentSigner() which calls prepareDataForSigning()
    //   2. prepareDataForSigning() returns Uint8Array of the hash to sign
    //   3. We sign that hash with Ed25519 via Veramo's KMS
    //
    // However, didwebvh-ts's AbstractCrypto.sign() receives the full
    // { document, proof } input. We need to replicate what prepareDataForSigning
    // does, then sign with the Veramo KMS.

    const { prepareDataForSigning } = await import('didwebvh-ts');

    const dataToSign = await prepareDataForSigning(input.document, input.proof);

    // Sign via Veramo KMS — returns base64url-encoded signature
    const signatureBase64url = await this.context.agent.keyManagerSign({
      keyRef: this.kid,
      data: Buffer.from(dataToSign).toString('hex'),
      algorithm: 'EdDSA',
      encoding: 'hex',
    });

    // Convert from base64url to base58btc multibase for eddsa-jcs-2022
    const signatureBytes = Buffer.from(signatureBase64url, 'base64url');
    const { multibaseEncode } = await import('didwebvh-ts');
    const proofValue = multibaseEncode(
      new Uint8Array(signatureBytes),
    );

    return { proofValue };
  }
}

/**
 * Creates a VeramoSigner that also implements the Verifier interface
 * expected by didwebvh-ts for resolution verification.
 *
 * @public
 */
export class VeramoVerifier {
  /**
   * Verifies an Ed25519 signature.
   * Uses the @noble/ed25519 library (transitive dep of didwebvh-ts).
   *
   * @param signature - The signature bytes
   * @param message - The message that was signed
   * @param publicKey - The public key bytes
   * @returns true if valid
   */
  async verify(
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array,
  ): Promise<boolean> {
    // Use @noble/hashes which is a transitive dependency of didwebvh-ts
    // For Ed25519 verification we import from @stablelib/ed25519 or noble
    try {
      const { ed25519 } = await import('@noble/curves/ed25519');
      return ed25519.verify(signature, message, publicKey);
    } catch {
      return false;
    }
  }
}
