import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { MagicDropzone } from "../../MagicDropzone";

export const DemoVerify: FunctionComponent = () => {
  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full lg:w-2/3 xl:w-1/2">
        <p className="mb-8">
          This is a demo verifier used specifically for verifying files created via our demo. To verify other files,
          please use the <NavLink to="/verify">verifier on our main net</NavLink>.
        </p>
        <MagicDropzone />
      </div>
    </div>
  );
};
