import React, { FunctionComponent, useState } from "react";
import { HelpCircle } from "react-feather";

export interface ToolTipProps {
  toolTipText?: string;
}

/*
 * Using tooltip
 * @param {string} infoText - Text that will be displayed in the tooltip
 * @param {string} toolTipStyle - Tailwind styles or CSS class to style the popup tooltip box
 */
export const ToolTip: FunctionComponent<ToolTipProps> = ({ toolTipText }) => {
  const [displayInfo, setDisplayInfo] = useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setDisplayInfo((prevState) => !prevState)} data-testid="tool-tip-button">
        <HelpCircle className="h-5 w-5 cursor-pointer" />
      </div>
      {displayInfo && (
        <>
          <div
            className="absolute z-20 top-8 left-12 bg-white p-4 shadow-md w-72 max-w-xs text-sm border"
            data-testid="tool-tip-text"
          >
            {toolTipText}
          </div>
          <div
            className="fixed top-0 left-0 z-10 w-screen h-screen"
            onClick={() => setDisplayInfo(false)}
            data-testid="close-tool-tip"
          />
        </>
      )}
    </div>
  );
};
