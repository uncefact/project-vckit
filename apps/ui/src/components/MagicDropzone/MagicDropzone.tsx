import React, { FunctionComponent, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { isValid } from "@govtechsg/oa-verify";
import { Button, ButtonSize, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { DetailedErrors } from "../DocumentDropzone/DetailedErrors";
import { updateDemoDocument, resetDemoState } from "../../reducers/demo-verify";
import { getDropzoneBoxUi } from "./../../common/utils/getDropzoneBoxUi";
import { gaEvent } from "./../../common/analytics";

interface MagicDropzoneViewProps {
  isPending: boolean;
  isError: boolean | null;
  resetDocument: () => void;
}

const MagicDropzoneView: FunctionComponent<MagicDropzoneViewProps> = ({ isPending, isError, resetDocument }) => {
  const { verificationStatus, verificationError } = useSelector((state: RootState) => state.demoVerify);

  switch (true) {
    case isPending:
      return (
        <div>
          <LoaderSpinner data-testid={"loader-spinner"} className="mx-auto" width="50px" primary="#0099cc" />
          <p className="m-4 text-2xl">Verifying Document...</p>
        </div>
      );
    case isError:
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
            <Button className="text-white bg-red-500 border-red-500 hover:bg-red-300 hover:border-red-300">
              What Should I do?
            </Button>
          </Link>
          <br />
          <div
            data-testid="try-another"
            className="my-8 transition-colors duration-200 underline cursor-pointer text-red-500 hover:text-gray-500"
            onClick={(e) => {
              e.preventDefault();
              resetDocument();
            }}
          >
            Try another document
          </div>
        </div>
      );
    default:
      return (
        <div>
          <h2 className="absolute top-0 left-0 right-0 mt-8 mx-auto text-gray-600 text-opacity-10 text-7xl lg:text-9xl">
            DEMO
          </h2>
          <img
            className="mx-auto w-56"
            alt="Magic Dropzone TradeTrust"
            src="/static/images/dropzone/dropzone_illustration.svg"
          />
          <h4>Drop your TradeTrust demo document to view its content</h4>
          <p className="my-6">Or</p>
          <Button className="bg-cerulean text-white hover:bg-cerulean-500" size={ButtonSize.SM}>
            Select Demo Document
          </Button>
        </div>
      );
  }
};

export const MagicDropzone: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { verificationPending, verificationStatus } = useSelector((state: RootState) => state.demoVerify);

  const isVerificationPending = verificationPending;
  const isVerificationError = verificationStatus && !isValid(verificationStatus);

  const onDrop = useCallback(
    (acceptedFiles: Blob[]) => {
      acceptedFiles.forEach((file: Blob) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            dispatch(updateDemoDocument(json)); // pushes to `/viewer` page
            gaEvent({
              action: "magic_demo_file_drop",
              category: "magic_demo",
            });
          } catch (e) {
            console.log(e);
          }
        };
        reader.readAsText(file);
      });
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    // accept: "application/json", // TODO: https://react-dropzone.js.org/#!/Accepting%20specific%20file%20types
  });

  const customStyle = useMemo(() => {
    return getDropzoneBoxUi({
      isDragReject,
      isDragActive,
      isDragAccept,
      isVerificationPending,
      isVerificationError,
    });
  }, [isDragReject, isDragActive, isDragAccept, isVerificationPending, isVerificationError]);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        className={`border-2 border-dashed rounded-xl text-center relative p-8 min-h-400 flex flex-col justify-center ${customStyle}`}
      >
        <MagicDropzoneView
          isPending={isVerificationPending}
          isError={isVerificationError}
          resetDocument={resetDemoState}
        />
      </div>
    </div>
  );
};
