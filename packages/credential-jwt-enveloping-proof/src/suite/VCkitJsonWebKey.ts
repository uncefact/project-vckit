import {
  hexToBytes,
  encodeJoseBlob,
  bytesToBase64url,
  concat,
  stringToUtf8Bytes,
  asArray,
  bytesToBase64,
} from '@veramo/utils';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';
import {
  CredentialPayload,
  IAgentContext,
  DIDDocument,
  IKey,
  TKeyType,
  IResolver,
  IKeyManager,
} from '@veramo/core-types';
import { VeramoLdSignature } from '@veramo/credential-ld';

/**
 * Veramo wrapper for the JsonWebKey suite by @panva/jose
 */
export class VCkitJsonWebKey extends VeramoLdSignature {
  getSupportedVerificationType(): string[] {
    return ['JsonWebKey', 'JsonWebKey2020'];
  }

  getSupportedVeramoKeyType(): TKeyType {
    return 'Ed25519';
  }

  async getSuiteForSigning(
    key: IKey,
    issuerDid: string,
    verificationMethodId: string,
    context: IAgentContext<IResolver & Pick<IKeyManager, 'keyManagerSign'>>,
  ): Promise<any> {
    
    // return suite;
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
        const headerString = encodeJoseBlob(header);
        const messageBuffer = concat([
          stringToUtf8Bytes(`${headerString}.`),
          args.data,
        ]);
        const messageString = bytesToBase64(messageBuffer);
        const signature = await context.agent.keyManagerSign({
          keyRef: key.kid,
          algorithm: 'EdDSA',
          data: messageString,
          encoding: 'base64',
        });
        return `${headerString}..${signature}`;
      },
    };

    const verificationKey = await JsonWebKey.from({
      id: id,
      type: 'JsonWebKey2020',
      controller: controller,
      publicKeyJwk: {
        kty: 'OKP',
        crv: 'Ed25519',
        x: bytesToBase64url(hexToBytes(key.publicKeyHex)),
      },
    });

    verificationKey.signer = () => signer;

    const suite = new JsonWebSignature({
      key: verificationKey,
    });

    suite.ensureSuiteContext = ({
      document,
    }: {
      document: any;
      addSuiteContext: boolean;
    }) => {
      document['@context'] = [
        ...asArray(document['@context'] || []),
        'https://w3id.org/security/suites/jws-2020/v1',
      ];
    };

    return suite;
  }

  getSuiteForVerification(): any {
    return new JsonWebSignature();
  }

  // If you need to modify the credential before signing, you can do it here
  preSigningCredModification(
    credential: CredentialPayload,
  ): CredentialPayload | void {}

  async preDidResolutionModification(
    didUrl: string,
    didDoc: DIDDocument,
    context: IAgentContext<IResolver>,
  ) {
    // When not have controllerKeyID in the didUrl, return the DID Document
    if (!didUrl.includes('#') || didUrl === didDoc.id) {
      return didDoc;
    }

    try {
      const didDocJsonWebKey2020 = didDoc?.verificationMethod?.find(
        (vm) => vm.type === 'JsonWebKey2020',
      ) as DIDDocument;

      // If the DID Document has no JsonWebKey2020, return the DID Document
      if (!didDocJsonWebKey2020) {
        return didDoc;
      }

      didDocJsonWebKey2020['@context'] = didDoc['@context'];

      // return the DID component (Verification Method)
      return didDocJsonWebKey2020;
    } catch (e: any) {
      console.log(
        `document loader could not locate DID component by fragment: ${didUrl}. ${e}`,
      );
      return didDoc;
    }
  }
}
