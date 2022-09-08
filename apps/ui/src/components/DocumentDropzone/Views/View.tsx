import React, { FunctionComponent } from "react";
import { Button } from "../../UI/Button";
import { SampleMobile } from "../SampleMobile";
import { useProviderContext } from "../../../common/contexts/provider";

interface ViewProps {
  toggleQrReaderVisible?: () => void;
}

export const View: FunctionComponent<ViewProps> = ({ toggleQrReaderVisible }) => {
  const { currentChainId } = useProviderContext();
  return (
    <div>
      <SampleMobile currentChainId={currentChainId} />
      <img
        className="mx-auto w-56"
        alt="Document Dropzone TradeTrust"
        src="/static/images/dropzone/dropzone_illustration.svg"
      />
      <h4>Drop your Verifiable Credential file to view its contents</h4>
      <p className="my-6">Or</p>
      <Button className="block mx-auto mb-5">Select Document</Button>
      <Button
        className="block mx-auto mb-5 md:hidden"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleQrReaderVisible && toggleQrReaderVisible();
        }}
      >
        Scan QR Code
      </Button>
    </div>
  );
};
