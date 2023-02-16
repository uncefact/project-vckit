import {
  VerifiableCredential,
  WrappedVerifiableCredential,
} from '@dvp/api-interfaces';
import { NON_OA_CREDENTIAL, OA_CREDENTIAL, OA_SIGNED } from '../fixtures';
import {
  isOpenAttestationType,
  isVerifiableCredential,
  isGenericDocument,
} from './vc';

describe('isOpenAttestationType', () => {
  it('should return true for document that contains OpenAttestation type', () => {
    const result = isOpenAttestationType(OA_CREDENTIAL as never);
    expect(result).toBe(true);
  });

  it('should return true for document that does not contain OpenAttestation type', () => {
    const result = isOpenAttestationType(NON_OA_CREDENTIAL as never);
    expect(result).toBe(false);
  });
});

describe('isVerifiableCredential', () => {
  describe('OpenAttestation', () => {
    it('should return true for a document that is a verifiable credential', () => {
      const result = isVerifiableCredential(
        OA_SIGNED as WrappedVerifiableCredential
      );
      expect(result).toBe(true);
    });

    it('should return false for a document that is a not a verifiable credential', () => {
      const result = isVerifiableCredential(
        // eslint-disable-next-line
        // @ts-ignore
        OA_CREDENTIAL
      );
      expect(result).toBe(false);
    });
  });
});

describe('isGenericDocument', () => {
  it('should return true if the document contains the originalDocument property (generic)', () => {
    const documentWithOriginalDocumentProperty = {
      ...NON_OA_CREDENTIAL,
      credentialSubject: {
        ...NON_OA_CREDENTIAL.credentialSubject,
        originalDocument: 'test123',
      },
    };
    expect(
      isGenericDocument(
        documentWithOriginalDocumentProperty as VerifiableCredential
      )
    ).toBe(true);
  });

  it('should return false if the document does not contain the originalDocument property', () => {
    expect(isGenericDocument(NON_OA_CREDENTIAL as VerifiableCredential)).toBe(
      false
    );
  });
});
