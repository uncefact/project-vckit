import {
  utils,
  isValid,
  verificationBuilder,
  VerificationFragmentType,
  openAttestationHash,
  openAttestationDidSignedDocumentStatus,
  openAttestationDnsTxtIdentityProof,
  openAttestationDnsDidIdentityProof,
  openAttestationDidIdentityProof,
} from "@govtechsg/oa-verify";

//Not for use in production
const ethProvider = utils.generateProvider({
  network: "ropsten",
  providerType: "infura",
  apiKey: "847083befddc412787676f40d3270443",
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

export const verify = async (verifiableCredential: any, options: any = {}) => {
  if (Object.keys(options).length > 0) {
    throw new Error(
      `Options  not yet supported in verify. \n (received: ${options})`
    );
  }
  //Which checks to do should be read from options (but currently is hard-coded)
  const checks: VerificationFragmentType[] = [
    "DOCUMENT_INTEGRITY",
    "DOCUMENT_STATUS",
    "ISSUER_IDENTITY",
  ];

  const translateOaCheckNames = (
    names: VerificationFragmentType[]
  ): string[] => {
    const translationMap = {
      DOCUMENT_INTEGRITY: "proof",
      DOCUMENT_STATUS: "status",
      ISSUER_IDENTITY: "identity", // should be ignored by non-OA platforms
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
