import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "../../UI/Button";
import { RootState } from "../../../reducers";
import { DetailedErrors } from "../DetailedErrors";

interface ViewVerificationErrorProps {
  resetData: () => void;
}

export const ViewVerificationError: FunctionComponent<ViewVerificationErrorProps> = ({ resetData }) => {
  const { verificationStatus, verificationError } = useSelector((state: RootState) => state.certificate);

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
      <DetailedErrors verificationStatus={verificationStatus} verificationError={verificationError} />
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
          e.stopPropagation();
          resetData();
        }}
      >
        Try another document
      </div>
    </div>
  );
};
