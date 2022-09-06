import React, { FunctionComponent } from "react";
import { VerificationFragment } from "@govtechsg/oa-verify";
import { CONSTANTS, interpretFragments } from "@govtechsg/tradetrust-utils";
import { StatusCheck } from "./StatusCheck";

interface StatusChecksProps {
  verificationStatus: VerificationFragment[];
}

export const StatusChecks: FunctionComponent<StatusChecksProps> = ({ verificationStatus }) => {
  const { hashValid, issuedValid, identityValid } = interpretFragments(verificationStatus);
  const { MESSAGES, TYPES } = CONSTANTS;

  return (
    <div className="flex items-start flex-col mt-2 lg:flex-row xl:mt-0">
      <div className="w-auto mx-0 lg:mr-4 mb-2 lg:mb-0">
        <StatusCheck valid={issuedValid} messageSet={MESSAGES[TYPES.ISSUED]} />
      </div>
      <div className="w-auto mx-0 lg:mr-4 mb-2 lg:mb-0">
        <StatusCheck valid={identityValid} messageSet={MESSAGES[TYPES.IDENTITY]} />
      </div>
      <div className="w-auto mx-0 mb-2 lg:mb-0">
        <StatusCheck valid={hashValid} messageSet={MESSAGES[TYPES.HASH]} />
      </div>
    </div>
  );
};
