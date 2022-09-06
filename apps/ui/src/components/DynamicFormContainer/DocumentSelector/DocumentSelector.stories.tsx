import React, { FunctionComponent } from "react";
import { DocumentSelector } from "./DocumentSelector";

export default {
  title: "DynamicForm/DocumentSelector",
  component: DocumentSelector,
  parameters: {
    componentSubtitle: "DocumentSelector.",
  },
};

export const Default: FunctionComponent = () => (
  <DocumentSelector validateCurrentForm={() => true} closePreviewMode={() => true} />
);
