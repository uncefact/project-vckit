import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { Button, ButtonVariant } from "../../UI/Button";
import { useConfigContext } from "../../../common/contexts/config";
import { checkContractOwnership, checkDID } from "../../../services/prechecks";
import { validateDns } from "../../../services/prechecks";
import { FormTemplate } from "../../../types";
import { getIssuerAddress } from "../../../utils";

interface FormSelectProps {
  id: string;
  form: FormTemplate;
  onAddForm: () => void;
}

const errorMsgDnsTxt = "The contract could not be found on it's DNS TXT records.";
const errorMsgOwnership = "The contract does not belong to the wallet.";

enum FormStatus {
  "INITIAL",
  "PENDING",
  "ERROR",
  "SUCCESS",
}

interface FormErrors {
  type: "dns" | "ownership";
  message: string;
}

export const FormSelect: FunctionComponent<FormSelectProps> = ({ id, form, onAddForm, ...props }) => {
  const { config } = useConfigContext();

  const [formErrors, setFormErrors] = useState<FormErrors[]>([]);
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.INITIAL);
  const refButton = useRef<HTMLDivElement>(null);

  const checkDns = async (): Promise<boolean> => {
    if (config?.network === "local") {
      return true; // for local e2e to pass, skip dns validate + set valid
    } else {
      const isDnsValidated = await validateDns(form);
      return isDnsValidated;
    }
  };

  const checkOwnership = async (): Promise<boolean> => {
    const isDID = checkDID(form.defaults);
    if (config?.network === "local") {
      return true; // for local e2e to pass, skip ownership validate + set valid
    } else if (isDID) {
      return true; // Assume DIDs are valid
    }
    const wallet = config?.wallet;
    const contractAddress = getIssuerAddress(form.defaults);

    if (contractAddress !== undefined && wallet !== undefined) {
      const contractType = form?.type;
      const valid = await checkContractOwnership(contractType, contractAddress, wallet);
      return valid;
    }
    return false;
  };

  const checkValidity = async () => {
    setFormStatus(FormStatus.PENDING);
    const isValidDns = await checkDns();
    const isValidOwner = await checkOwnership();

    if (!isValidDns || !isValidOwner) {
      if (!isValidDns && !isValidOwner) {
        setFormErrors([
          {
            type: "dns",
            message: errorMsgDnsTxt,
          },
          {
            type: "ownership",
            message: errorMsgOwnership,
          },
        ]);
      } else if (!isValidDns) {
        setFormErrors([
          {
            type: "dns",
            message: errorMsgDnsTxt,
          },
        ]);
      } else if (!isValidOwner) {
        setFormErrors([
          {
            type: "ownership",
            message: errorMsgOwnership,
          },
        ]);
      }
      setFormStatus(FormStatus.ERROR);
    } else {
      setFormErrors([]);
      setFormStatus(FormStatus.SUCCESS);
    }
  };

  useEffect(() => {
    if (formStatus === FormStatus.SUCCESS) {
      onAddForm();
    }
  }, [formStatus, onAddForm]);

  const handleForm = async (): Promise<void> => {
    if (formStatus === FormStatus.INITIAL) {
      checkValidity();
    } else if (formStatus === FormStatus.ERROR) {
      ReactTooltip.show(refButton.current as unknown as Element);
    }
  };

  const getTooltipMessage = () => {
    if (formStatus === FormStatus.PENDING) {
      return "Loading...";
    }

    if (formErrors.length > 0) {
      return formErrors.map((error) => `${error.message}`).join(" ");
    } else {
      return null;
    }
  };

  return (
    <>
      <div ref={refButton} data-tip data-for={`tooltip-${id}`} data-testid="tooltip-form-select">
        <Button
          variant={
            formStatus === FormStatus.PENDING || formStatus === FormStatus.ERROR
              ? ButtonVariant.DISABLED
              : ButtonVariant.OUTLINE_PRIMARY
          }
          className="w-11/12 "
          onClick={() => handleForm()}
          {...props}
        >
          {formStatus === FormStatus.PENDING ? (
            <div className="flex flex-col flex-wrap">
              <div>{form.name}</div>
              <LoaderSpinner className="content-center self-center mt-1" />
            </div>
          ) : (
            form.name
          )}
        </Button>
      </div>
      <ReactTooltip
        className="max-w-xs break-words"
        id={`tooltip-${id}`}
        multiline={true}
        place={`bottom`}
        type="dark"
        effect="solid"
        getContent={getTooltipMessage}
      />
    </>
  );
};
