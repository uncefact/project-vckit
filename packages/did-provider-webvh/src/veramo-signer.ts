import type { IAgentContext, IKeyManager } from '@uncefact/vckit-core-types';
import { ed25519 } from '@noble/curves/ed25519';
import {
  multibaseEncode, MultibaseEncoding, prepareDataForSigning,
  type Signer, type SigningInput, type SigningOutput, type Verifier,
} from 'didwebvh-ts';

/** Bridges WebVH Data Integrity proofs to Veramo's Ed25519 key manager. @public */
export class VeramoSigner implements Signer {
  constructor(
    private kid: string,
    private verificationMethodId: string,
    private context: IAgentContext<IKeyManager>,
  ) {}

  getVerificationMethodId(): string {
    return this.verificationMethodId;
  }

  async sign({ document, proof }: SigningInput): Promise<SigningOutput> {
    const data = await prepareDataForSigning(document, proof);
    const signature = await this.context.agent.keyManagerSign({
      keyRef: this.kid,
      data: Buffer.from(data).toString('hex'),
      algorithm: 'EdDSA',
      encoding: 'hex',
    });
    return {
      proofValue: multibaseEncode(
        Buffer.from(signature, 'base64url'),
        MultibaseEncoding.BASE58_BTC,
      ),
    };
  }
}

/** Verifies WebVH Ed25519 signatures, rejecting malformed signature inputs. @public */
export class VeramoVerifier implements Verifier {
  async verify(signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
    try {
      return ed25519.verify(signature, message, publicKey);
    } catch {
      return false;
    }
  }
}
