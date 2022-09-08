import {
  verificationBuilder,
  openAttestationVerifiers,
  openAttestationDidIdentityProof,
  VerificationFragment,
  DocumentsToVerify,
} from "@govtechsg/oa-verify";
import { providers } from "ethers";
import { NETWORK_NAME } from "../../config";
import { getCurrentProvider } from "../../common/contexts/provider";

export enum VerifierType {
  DEMO = "demo",
  CUSTOM = "custom",
}

const verificationOption = (provider: providers.Provider | undefined) => {
  if (provider) return { provider };
  if (NETWORK_NAME === "local") return { provider: new providers.JsonRpcProvider(), network: NETWORK_NAME };
  return { network: NETWORK_NAME };
};

const customVerifier = (provider: providers.Provider | undefined) =>
  verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], verificationOption(provider));

const demoVerifier = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
  network: "ropsten",
});

export const verifyDocument = async (
  document: DocumentsToVerify,
  verifierType = VerifierType.CUSTOM
): Promise<VerificationFragment[]> => {
  return verifierType === VerifierType.DEMO ? demoVerifier(document) : customVerifier(getCurrentProvider())(document);
};
