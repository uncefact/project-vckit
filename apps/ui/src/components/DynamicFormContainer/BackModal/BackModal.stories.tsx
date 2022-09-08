import React, { FunctionComponent } from "react";
import { BackModal } from "./BackModal";

export default {
  title: "DynamicForm/BackModal",
  component: BackModal,
  parameters: {
    componentSubtitle: "BackModal.",
  },
};

export const Default: FunctionComponent = () => (
  <BackModal backToFormSelection={() => true} show={true} closeBackModal={() => false} />
);
