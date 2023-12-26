import {
  CredentialPayload,
  DIDDocument,
  IAgentContext,
  IKey,
  TKeyType,
} from '@vckit/core-types';
import { RequiredAgentMethods, VCKitMDPSignature } from '../mdp-suites.js';
import { JsonWebKey } from '@transmute/json-web-signature';
import { MerkleDisclosureProof2021 } from '../merkle-disclosure-proof-2021/MerkleDisclosureProof2021.js';
import { encodeBase64url, encodeJoseBlob } from '@veramo/utils';
import * as u8a from 'uint8arrays';

/**
 * VCKit wrapper for the MerkleDisclosureProof2021 suite by Transmute Industries
 *
 * @alpha This API is experimental and is very likely to change or disappear in future releases without notice.
 */
export class VCKitMerkleDisclosureProof2021 extends VCKitMDPSignature {
  getSupportedVerificationType(): 'JsonWebKey2020' {
    return 'JsonWebKey2020';
  }

  getSupportedVeramoKeyType(): TKeyType {
    return 'Ed25519';
  }

  async getSuiteForSigning(
    key: IKey,
    issuerDid: string,
    verificationMethodId: string,
    context: IAgentContext<RequiredAgentMethods>
  ): Promise<any> {
    const controller = issuerDid;

    // DID Key ID
    let id = verificationMethodId;

    const signer = {
      // returns a JWS detached
      sign: async (args: { data: Uint8Array }): Promise<string> => {
        const header = {
          alg: 'EdDSA',
          b64: false,
          crit: ['b64'],
        };

        const encodedPayload = encodeBase64url(
          args.data instanceof Uint8Array
            ? Buffer.from(args.data).toString('utf-8')
            : JSON.stringify(args.data)
        );
        const headerString = encodeJoseBlob(header);
        const toBeSigned = new Uint8Array(
          Buffer.from(`${headerString}.${encodedPayload}`)
        );
        const messageString = u8a.toString(toBeSigned, 'base64');

        const signature = await context.agent.keyManagerSign({
          keyRef: key.kid,
          algorithm: 'EdDSA',
          data: messageString,
          encoding: 'base64',
        });
        return `${headerString}.${encodedPayload}.${signature}`;
      },
    };

    const verificationKey = await JsonWebKey.from({
      id: id,
      type: this.getSupportedVerificationType(),
      controller: controller,
      publicKeyJwk: {
        kty: 'OKP',
        crv: 'Ed25519',
        x: u8a.toString(u8a.fromString(key.publicKeyHex, 'hex'), 'base64url'),
      },
    });

    verificationKey.signer = () => signer;

    const suite: any = new MerkleDisclosureProof2021({
      key: verificationKey,
      date: new Date().toISOString(),
      normalization: 'jsonPointer',
    });
    suite.ensureSuiteContext = ({
      document,
    }: {
      document: any;
      addSuiteContext: boolean;
    }) => {
      // nop
    };

    return suite;
  }

  getSuiteForVerification(): any {
    const suite: any = new MerkleDisclosureProof2021({
      normalization: 'jsonPointer',
    });
    suite.matchProof = ({ proof }: any) => {
      return proof.type === MerkleDisclosureProof2021.type;
    };

    return suite;
  }

  preSigningCredModification(credential: CredentialPayload): void {
    // nop
  }

  async preDidResolutionModification(
    didUrl: string,
    didDoc: DIDDocument
  ): Promise<DIDDocument> {
    // do nothing
    return didDoc;
  }
}
