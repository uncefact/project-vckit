import React from "react";
import { SvgIcon, SvgIconQRCode, TooltipIcon } from "./SvgIcon";
import { Info } from "react-feather";

export default {
  title: "UI/SvgIcon",
  component: SvgIcon,
  parameters: {
    componentSubtitle: "Custom types of icons, or those with Tooltip functionality.",
  },
};

export const QrCode = () => {
  return (
    <SvgIcon strokeWidth="0.5" fill="currentColor">
      <SvgIconQRCode />
    </SvgIcon>
  );
};

export const Tooltip = () => {
  return (
    <TooltipIcon content={<>dummy info here</>}>
      <Info />
    </TooltipIcon>
  );
};
