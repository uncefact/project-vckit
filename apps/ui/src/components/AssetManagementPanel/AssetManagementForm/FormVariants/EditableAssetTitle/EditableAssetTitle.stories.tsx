import React from "react";
import { EditableAssetTitle } from "./EditableAssetTitle";

export default {
  title: "TitleTransfer/EditableAssetTitle",
  component: EditableAssetTitle,
  parameters: {
    componentSubtitle: "When respective address becomes editable, upon corresponding setFormAction.",
  },
};

export const NotEditable = () => {
  return (
    <EditableAssetTitle
      role="Owner"
      value="0xb1D285c49054c7B4D24228Ad3dd3d9a0796e2d16"
      isEditable={false}
      newValue=""
      onSetNewValue={() => {}}
    />
  );
};

export const Editable = () => {
  return (
    <EditableAssetTitle
      role="Owner"
      value="0xb1D285c49054c7B4D24228Ad3dd3d9a0796e2d16"
      isEditable={true}
      newValue=""
      onSetNewValue={() => {}}
    />
  );
};
