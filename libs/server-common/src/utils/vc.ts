import {
  VerifiableCredential,
  WrappedVerifiableCredential,
} from '@dvp/api-interfaces';
import { utils, validateSchema } from '@govtechsg/open-attestation';

export const isOpenAttestationType = (
  credential: VerifiableCredential | WrappedVerifiableCredential
) => {
  if (credential?.type?.includes('OpenAttestationCredential')) {
    return true;
  } else {
    return false;
  }
};

export const isVerifiableCredential = (
  document: WrappedVerifiableCredential
) => {
  if (isOpenAttestationType(document)) {
    return (
      validateSchema(document) &&
      (utils.isWrappedV2Document(document) ||
        utils.isWrappedV3Document(document))
    );
  } else if (document?.type?.includes('VerifiableCredential')) {
    return true;
  } else {
    return false;
  }
};

export const isGenericDocument = (document: VerifiableCredential) => {
  return 'originalDocument' in document.credentialSubject;
};
