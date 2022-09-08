import uniqueId from "lodash/uniqueId";
import React, { FunctionComponent, useState } from "react";
import ReactTooltip from "react-tooltip";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  tooltipId?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface TooltipIconProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  placement?: "top" | "right" | "bottom" | "left";
}

export const TooltipIcon: FunctionComponent<TooltipIconProps> = ({
  content,
  children,
  className,
  placement = "right",
}) => {
  const [id] = useState(uniqueId("tt-"));

  return (
    <>
      <SvgIcon tooltipId={id} className={className}>
        {children}
      </SvgIcon>
      <ReactTooltip
        id={`tooltip-${id}`}
        place={placement}
        type="dark"
        effect="solid"
        getContent={() => {
          return content;
        }}
      />
    </>
  );
};

export const SvgIconQRCode: FunctionComponent = () => {
  return (
    <g className="qrcode">
      <path d="M9 0H0V9H9V0ZM7.5 7.5H1.5V1.5H7.5V7.5Z" />
      <path d="M3 3H6V6H3V3Z" />
      <path d="M0 24H9V15H0V24ZM1.5 16.5H7.5V22.5H1.5V16.5Z" />
      <path d="M3 18H6V21H3V18Z" />
      <path d="M15 0V9H24V0H15ZM22.5 7.5H16.5V1.5H22.5V7.5Z" />
      <path d="M18 3H21V6H18V3Z" />
      <path d="M3 10.5H0V13.5H4.5V12H3V10.5Z" />
      <path d="M10.5 13.5H13.5V16.5H10.5V13.5Z" />
      <path d="M4.5 10.5H7.5V12H4.5V10.5Z" />
      <path d="M13.5 18H10.5V19.5H12V21H13.5V19.5V18Z" />
      <path d="M9 10.5V12H7.5V13.5H10.5V10.5H9Z" />
      <path d="M12 6H13.5V9H12V6Z" />
      <path d="M13.5 12V13.5H16.5V10.5H12V12H13.5Z" />
      <path d="M10.5 9H12V10.5H10.5V9Z" />
      <path d="M13.5 21H16.5V24H13.5V21Z" />
      <path d="M10.5 21H12V24H10.5V21Z" />
      <path d="M13.5 16.5H15V18H13.5V16.5Z" />
      <path d="M13.5 4.5V1.5H12V0H10.5V6H12V4.5H13.5Z" />
      <path d="M18 21H19.5V24H18V21Z" />
      <path d="M18 18H21V19.5H18V18Z" />
      <path d="M16.5 19.5H18V21H16.5V19.5Z" />
      <path d="M15 18H16.5V19.5H15V18Z" />
      <path d="M21 15V16.5H22.5V18H24V15H22.5H21Z" />
      <path d="M22.5 19.5H21V24H24V21H22.5V19.5Z" />
      <path d="M15 15V16.5H19.5V13.5H16.5V15H15Z" />
      <path d="M18 10.5V12H21V13.5H24V10.5H21H18Z" />
    </g>
  );
};

export const SvgIcon: FunctionComponent<SvgIconProps> = ({ tooltipId, children, ...props }) => {
  const tooltipProps = tooltipId
    ? {
        "data-tip": "",
        "data-for": `tooltip-${tooltipId}`,
      }
    : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...tooltipProps}
      {...props}
    >
      {children}
    </svg>
  );
};
