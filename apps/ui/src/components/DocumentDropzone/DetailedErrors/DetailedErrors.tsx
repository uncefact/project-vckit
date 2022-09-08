import React, { FunctionComponent } from "react";
import { VerificationFragment } from "@govtechsg/oa-verify";
import { CONSTANTS, errorMessageHandling } from "@govtechsg/tradetrust-utils";

export const DetailedError: FunctionComponent<{ title: string; message: string }> = ({ title, message }) => {
  return (
    <div className="my-2 sm:mx-8 xl:mx-16">
      <h4 className="text-red-500 mb-0">{title}</h4>
      <p className="text-gray-700 break-words">{message}</p>
    </div>
  );
};

export const DetailedErrors: FunctionComponent<{
  verificationStatus: VerificationFragment[] | null;
  verificationError: string | null;
}> = ({ verificationStatus, verificationError }) => {
  if (!verificationStatus) return null;
  const { MESSAGES } = CONSTANTS;
  const errors = errorMessageHandling(verificationStatus);
  if (verificationError) errors.push(verificationError);

  return (
    <div className="mb-8">
      {errors.map((errorType, index) => (
        <DetailedError
          key={index}
          title={MESSAGES[errorType].failureTitle}
          message={MESSAGES[errorType].failureMessage}
        />
      ))}
    </div>
  );
};
