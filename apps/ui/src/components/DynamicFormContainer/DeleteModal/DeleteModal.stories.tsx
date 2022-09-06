import React, { FunctionComponent } from "react";
import { DeleteModal } from "./DeleteModal";

export default {
  title: "DynamicForm/DeleteModal",
  component: DeleteModal,
  parameters: {
    componentSubtitle: "DeleteModal.",
  },
};

export const Default: FunctionComponent = () => (
  <DeleteModal deleteForm={() => true} show={true} closeDeleteModal={() => false} />
);
