import React, { FunctionComponent, useEffect } from "react";
import { OverlayContent, Button } from "@govtechsg/tradetrust-ui-components";

interface ModalNavigateOutProps {
  closeModal: () => void;
  closeModalAndNavigate: () => void;
  setOnNavigateOut: (isUserNavigateOut: boolean) => void;
}

export const ModalNavigateOut: FunctionComponent<ModalNavigateOutProps> = ({
  closeModal,
  closeModalAndNavigate,
  setOnNavigateOut,
}) => {
  useEffect(() => {
    setOnNavigateOut(true);
    return () => {
      setOnNavigateOut(false);
    };
  }, [setOnNavigateOut]);

  return (
    <OverlayContent title="" className="max-w-md px-6 pb-12 text-center">
      <svg
        className="mx-auto mb-4"
        width="57"
        height="56"
        viewBox="0 0 57 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M52.3609 23.2432L52.6448 25.371C53.3072 30.3589 52.3396 35.4273 49.8862 39.8203C47.4328 44.2132 43.6251 47.6955 39.0309 49.7476C34.4368 51.7998 29.3023 52.3118 24.3934 51.2075C19.4844 50.1032 15.0639 47.4416 11.7912 43.6197C8.51851 39.7978 6.56892 35.0204 6.2332 29.9999C5.89748 24.9795 7.19364 19.985 9.92834 15.7614C12.6631 11.5378 16.6898 8.31132 21.408 6.56322C26.1262 4.81511 31.2831 4.63901 36.1096 6.06119"
          stroke="#F57A29"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="30"
          y1="14.5"
          x2="30"
          y2="35.5"
          stroke="#F57A29"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="30" cy="42.5" r="1.5" fill="#F57A29" />
      </svg>
      <h5 className="mb-8">
        You are about to navigate away from this demo, navigating away will result in the loss of input information
      </h5>
      <Button onClick={closeModal} className="bg-white text-cerulean-500 hover:bg-gray-50 lg:mr-2">
        Back to demo
      </Button>
      <Button onClick={closeModalAndNavigate} className="bg-cerulean text-white hover:bg-cerulean-500">
        Navigate away
      </Button>
    </OverlayContent>
  );
};
