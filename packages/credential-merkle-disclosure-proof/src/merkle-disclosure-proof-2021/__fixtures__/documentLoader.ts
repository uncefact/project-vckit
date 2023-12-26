import sec from '@transmute/security-context';
import cre from '@transmute/credentials-context';
import did from '@transmute/did-context';
import mdp2021Context from './contexts/mdp-2021.json';

import { controller0 } from './controllers';

const contexts: any = {
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),
  [sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sec.contexts.get(
    sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL
  ),
  'https://w3id.org/security/suites/merkle-jws-2021/v1': mdp2021Context,
};

export const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }

  if (iri.startsWith(controller0.id)) {
    return {
      documentUrl: iri,
      document: controller0,
    };
  }

  console.warn('Unsupported iri ' + iri);
  throw new Error('Unsupported iri ' + iri);
};
