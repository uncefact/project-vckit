import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "../../UI/Button";
import { RootState } from "../../../reducers";
import { DetailedError } from "../../DocumentDropzone/DetailedErrors";

interface ViewActionErrorProps {
  resetData: () => void;
}

export const ViewActionError: FunctionComponent<ViewActionErrorProps> = ({ resetData }) => {
  const { retrieveCertificateByActionError } = useSelector((state: RootState) => state.certificate);

  return (
    <div>
      <div className="flex justify-center items-center my-4">
        <div className="w-auto mr-2">
          <img src="/static/images/dropzone/invalid.svg" alt="Document invalid" />
        </div>
        <div className="w-auto">
          <p className="text-2xl">This document is not valid</p>
        </div>
      </div>
      <DetailedError
        title={`Unable to load certificate with the provided parameters`}
        message={retrieveCertificateByActionError}
      />
      <Link
        to="/faq"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button variant={ButtonVariant.ERROR}>What Should I do?</Button>
      </Link>
      <br />
      <div
        data-testid="try-another"
        className="my-8 transition-colors duration-200 underline cursor-pointer text-red-500 hover:text-gray-500"
        onClick={(e) => {
          e.preventDefault();
          resetData();
        }}
      >
        Try another document
      </div>
    </div>
  );
};
