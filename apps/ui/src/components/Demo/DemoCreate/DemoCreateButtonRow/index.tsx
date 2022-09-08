import React, { FunctionComponent } from "react";
import { Button } from "@govtechsg/tradetrust-ui-components";

interface DemoCreateButtonRowProps {
  onBack?: () => void;
  onNext?: () => void;
}

export const DemoCreateButtonRow: FunctionComponent<DemoCreateButtonRowProps> = ({ onBack, onNext }) => {
  return (
    <div className="flex justify-center pt-12 pb-3">
      {onBack && (
        <Button
          data-testid="demo-create-button-back"
          className="mx-12 bg-white text-cerulean hover:bg-cloud-200"
          onClick={onBack}
        >
          Back
        </Button>
      )}
      {onNext && (
        <Button
          data-testid="demo-create-button-next"
          className="mx-12 bg-cerulean text-white hover:bg-cerulean-500"
          onClick={onNext}
        >
          Next
        </Button>
      )}
    </div>
  );
};
