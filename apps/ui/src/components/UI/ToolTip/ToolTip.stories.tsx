import React, { ReactElement } from "react";
import { ToolTip } from "./ToolTip";
import { HelpCircle } from "react-feather";

export default {
  title: "UI/ToolTip",
  component: ToolTip,
  parameters: {
    componentSubtitle: "Custom more Info icon component",
  },
};

export const Default = (): ReactElement => {
  return (
    <div className="mt-20">
      <ToolTip toolTipText="testing testing testing testing testing testing testing testing testing testing testing" />
    </div>
  );
};

export const ResizeToolTip = (): ReactElement => {
  return (
    <div className="mt-20">
      <ToolTip toolTipText="testing testing testing testing testing testing testing testing testing testing testing" />
    </div>
  );
};

export const NoText = (): ReactElement => {
  return (
    <div className="mt-20">
      <ToolTip />
    </div>
  );
};

export const ChangeIcon = (): ReactElement => {
  return (
    <div className="mt-20">
      <ToolTip toolTipText="testing testing testing testing testing testing testing testing testing testing testing">
        <HelpCircle className="text-yellow-500" />
      </ToolTip>
    </div>
  );
};
