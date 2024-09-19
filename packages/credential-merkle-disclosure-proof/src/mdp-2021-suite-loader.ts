import { VeramoLdSignature } from '@veramo/credential-ld';
import { TKeyType } from '@vckit/core-types';

/**
 * Initializes a list of Signature suites and exposes those to the Agent Module
 */
export class MDP2021SuiteLoader {
  constructor(options: { signatures: VeramoLdSignature[] }) {
    options.signatures.forEach((obj) => {
      // FIXME: some suites would work for multiple key types, but this only returns a single value per suite.
      //       For example, EcdsaSecp256k1RecoverySignature2020 should work with both EcdsaSecp256k1VerificationKey2019
      //       as well as EcdsaSecp256k1RecoveryMethod2020 since the VerificationKey can also be expressed as the recovery
      //       method.
      const keyType = obj.getSupportedVeramoKeyType();
      const verificationType = obj.getSupportedVerificationType();
      if (verificationType !== 'JsonWebKey2020') {
        throw new Error('Only JsonWebKey2020 is supported for now.');
      }

      return (this.signatureMap[keyType] = {
        ...this.signatureMap[keyType],
        [verificationType]: obj,
      });
    });
  }

  private signatureMap: Record<string, Record<string, VeramoLdSignature>> = {};

  getSignatureSuiteForKeyType(type: TKeyType, verificationType: string) {
    const suite = this.signatureMap[type]?.[verificationType];
    if (suite) return suite;

    throw new Error('No Signature Suite for ' + type);
  }

  getAllSignatureSuites(): VeramoLdSignature[] {
    return Object.values(this.signatureMap)
      .map((x) => Object.values(x))
      .flat();
  }

  getAllSignatureSuiteTypes() {
    return Object.values(this.signatureMap)
      .map((x) => Object.keys(x))
      .flat();
  }
}
