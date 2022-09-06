import React, { FunctionComponent } from "react";
import { AlertTriangle } from "react-feather";

interface EndorsementChainErrorProps {
  error?: string;
}

export const EndorsementChainError: FunctionComponent<EndorsementChainErrorProps> = ({ error }) => {
  return (
    <div className="text-center">
      <AlertTriangle className="text-rose" />
      <h4>{error} has occurred, please try again later.</h4>
    </div>
  );
};
