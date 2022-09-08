import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, ReactNode } from "react";

interface ILoadingModal {
  title: string;
  content: ReactNode;
}

export const LoadingModal: FunctionComponent<ILoadingModal> = ({ title, content }) => {
  return (
    <>
      <div
        data-testid="loading-modal"
        className="z-50 fixed top-0 left-0 w-screen h-screen bg-transparent flex justify-center items-center"
      >
        <div className="px-4 py-8 bg-white text-center rounded-lg w-96">
          <LoaderSpinner width="50px" primary="#3B8CC5" className="mx-auto flex mb-2 h-16 w-16" />
          <h3 className="my-4">{title}</h3>
          {content}
        </div>
      </div>
      <div className="z-40 fixed top-0 left-0 w-screen h-screen bg-black opacity-60" />
    </>
  );
};
