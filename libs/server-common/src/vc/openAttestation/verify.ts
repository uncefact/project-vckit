import { VerificationResult } from '@dvp/api-interfaces';
import {
  DocumentsToVerify,
  isValid,
  openAttestationDidIdentityProof,
  openAttestationDidSignedDocumentStatus,
  openAttestationDnsDidIdentityProof,
  openAttestationDnsTxtIdentityProof,
  openAttestationHash,
  utils,
  verificationBuilder,
  VerificationFragmentType,
} from '@govtechsg/oa-verify';

//TODO: production strategy
const ethProvider = utils.generateProvider({
  network: 'goerli',
});

const oaVerifiersToRun = [
  openAttestationHash,
  openAttestationDidSignedDocumentStatus,
  openAttestationDnsTxtIdentityProof,
  openAttestationDnsDidIdentityProof,
  openAttestationDidIdentityProof,
];

const builtVerifier = verificationBuilder(oaVerifiersToRun, {
  provider: ethProvider,
});

export const verifyCredential = async (
  verifiableCredential: DocumentsToVerify
): Promise<VerificationResult> => {
  //Which checks to do should be read from options, and credential contents
  //(but currently is hard-coded)
  const checks: VerificationFragmentType[] = [
    'DOCUMENT_INTEGRITY',
    'DOCUMENT_STATUS',
    'ISSUER_IDENTITY',
  ];

  const translateOaCheckNames = (
    names: VerificationFragmentType[]
  ): string[] => {
    const translationMap = {
      DOCUMENT_INTEGRITY: 'proof',
      DOCUMENT_STATUS: 'status',
      ISSUER_IDENTITY: 'identity',
    };
    return names.map((checkName) =>
      checkName in translationMap ? translationMap[checkName] : checkName
    );
  };

  const fragments = await builtVerifier(verifiableCredential);
  const failedOAChecks = checks.filter((checkName) => {
    return !isValid(fragments, [checkName]);
  });

  return {
    checks: translateOaCheckNames(checks),
    errors: translateOaCheckNames(failedOAChecks),
    warnings: [],
  };
};
