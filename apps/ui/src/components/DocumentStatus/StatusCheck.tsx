import React, { FunctionComponent } from "react";
import { CheckCircle, XCircle } from "react-feather";

interface StatusProps {
  message: string;
  icon: React.ReactNode;
}

const Status = ({ message, icon }: StatusProps) => (
  <div className="flex justify-start items-center">
    <div>{icon}</div>
    <div className="flex-grow">
      <p className="pl-2 mb-0 text-sm leading-5">{message}</p>
    </div>
  </div>
);

interface StatusCheck {
  valid: boolean;
  messageSet: {
    failureTitle: string;
    successTitle: string;
    failureMessage: string;
  };
}

export const StatusCheck: FunctionComponent<StatusCheck> = ({ valid, messageSet }) => {
  const message = valid ? messageSet.successTitle : messageSet.failureTitle;
  const icon = valid ? <CheckCircle className="text-emerald" /> : <XCircle className="text-rose" />;

  return <Status message={message} icon={icon} />;
};
