import { ResolutionResult } from "@govtechsg/address-identity-resolver";
import React, { FunctionComponent } from "react";
interface AddressInfoProps extends ResolutionResult {
  className?: string;
  title: string;
  children: React.ReactNode;
}

export const AddressInfo: FunctionComponent<AddressInfoProps> = ({
  className,
  title,
  name,
  resolvedBy,
  source,
  children,
}) => {
  return (
    <div className={`${className ? className : ""}`}>
      <h6 className="text-cloud-300 text-xl mb-2 font-bold">{title}:</h6>
      {name && (
        <div className="flex">
          <h5 className="text-cloud-900 mb-1 font-bold">{name}</h5>
        </div>
      )}
      <div className="inline-block break-all w-full font-semibold text-cloud-500">{children}</div>
      {resolvedBy && (
        <div className="flex">
          <span className="text-sm font-bold text-cloud-300">
            (Resolved by: {resolvedBy}
            {source && `; Source: ${source}`})
          </span>
        </div>
      )}
    </div>
  );
};
