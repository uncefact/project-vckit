import { Textual } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";

export const contentPdpa: FunctionComponent<React.ReactNode> = () => {
  return (
    <Textual title="Consent to process data *" className="max-w-md py-8 px-12">
      <p>
        In order to contact you or provide the content requested, we need to store and process the personal data you
        provide us. If you consent to us storing your personal data for this purpose, please tick the checkbox.
      </p>
    </Textual>
  );
};
