import React, { FunctionComponent } from "react";
import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";

export const ViewVerificationPending: FunctionComponent = () => {
  return (
    <div>
      <LoaderSpinner data-testid={"loader-spinner"} className="mx-auto" width="50px" primary="#0099cc" />
      <p className="m-4 text-2xl">Verifying Document...</p>
    </div>
  );
};
