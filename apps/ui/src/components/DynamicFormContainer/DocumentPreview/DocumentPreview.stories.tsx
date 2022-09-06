import { v2 } from "@govtechsg/open-attestation";
import React, { FunctionComponent } from "react";
import { DocumentPreview } from "./DocumentPreview";

import SampleCnm from "../../../test/fixture/sample-files/v2/raw/unwrapped-cnm.json";

export default {
  title: "DynamicForm/DocumentPreview",
  component: DocumentPreview,
  parameters: {
    componentSubtitle: "DocumentPreview.",
  },
};

export const TitleAndMessage: FunctionComponent = () => (
  <DocumentPreview document={SampleCnm as v2.OpenAttestationDocument} />
);
