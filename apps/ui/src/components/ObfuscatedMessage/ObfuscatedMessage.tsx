import { utils } from "@govtechsg/open-attestation";
import React, { FunctionComponent } from "react";
import { WrappedOrSignedOpenAttestationDocument } from "../../utils/shared";

interface ObfuscatedMessageProps {
  document: WrappedOrSignedOpenAttestationDocument;
}

export const ObfuscatedMessage: FunctionComponent<ObfuscatedMessageProps> = ({ document }) => {
  if (!utils.isObfuscated(document)) return null;

  return (
    <div className="container">
      <div className="text-lg font-bold text-rose" data-testid="obfuscation-info">
        <p className="py-6">Note: There are fields/data obfuscated in this document.</p>
      </div>
    </div>
  );
};
