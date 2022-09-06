import { Overlay, OverlayContext } from "@govtechsg/tradetrust-ui-components";
import React from "react";
import { FunctionComponent, useContext } from "react";

export interface InfoOverlayProps {
  className?: string;
  children: React.ReactNode;
}

export const InfoOverlay: FunctionComponent<InfoOverlayProps> = ({ className, children }) => {
  const { showOverlay } = useContext(OverlayContext);

  return (
    <>
      <Overlay />
      <div className={className} onClick={() => showOverlay(children)}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
          <title>Network Selector Info</title>
          <path
            d="M7.8999 11.3C7.8999 10.6 7.9999 10.2 8.1999 9.9C8.3999 9.6 8.7999 9.2 9.2999 8.8C9.5999 8.5 9.8999 8.2 10.0999 7.9C10.2999 7.6 10.3999 7.2 10.3999 6.9C10.3999 6.5 10.2999 6.1 10.0999 5.9C9.8999 5.7 9.5999 5.5 9.0999 5.5C8.7999 5.5 8.4999 5.6 8.1999 5.8C7.9999 6 7.8999 6.3 7.8999 6.7H5.8999C5.8999 5.8 6.1999 5.1 6.7999 4.7C7.3999 4.2 8.1999 4 9.1999 4C10.1999 4 11.0999 4.3 11.5999 4.8C12.1999 5.3 12.4999 6 12.4999 6.9C12.4999 7.5 12.2999 8 11.9999 8.5C11.6999 9 11.1999 9.4 10.6999 9.8C10.3999 10 10.1999 10.2 10.0999 10.5C9.9999 10.6 9.9999 10.9 9.9999 11.3H7.8999Z"
            fill="#4BC3E9"
          />
          <path
            d="M8.9002 14.3004C9.56294 14.3004 10.1002 13.7631 10.1002 13.1004C10.1002 12.4376 9.56294 11.9004 8.9002 11.9004C8.23745 11.9004 7.7002 12.4376 7.7002 13.1004C7.7002 13.7631 8.23745 14.3004 8.9002 14.3004Z"
            fill="#4BC3E9"
          />
          <path
            d="M9 2C12.9 2 16 5.1 16 9C16 12.9 12.9 16 9 16C5.1 16 2 12.9 2 9C2 5.1 5.1 2 9 2ZM9 0C4 0 0 4 0 9C0 14 4 18 9 18C14 18 18 14 18 9C18 4 14 0 9 0Z"
            fill="#4BC3E9"
          />
        </svg>
      </div>
    </>
  );
};
