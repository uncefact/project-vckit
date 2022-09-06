import { FunctionComponent, useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/contexts/config";
import { RevokeDocumentDropZone } from "./RevokeDocumentDropZone/RevokeDocumentDropZone";
import { RevokeDocumentTileArea } from "./RevokeDocumentTileArea/RevokeDocumentTileArea";
import { utils } from "@govtechsg/open-attestation";
import { RevokeConfirmationModal } from "./RevokeConfirmationModal";
import { verificationBuilder, openAttestationVerifiers } from "@govtechsg/oa-verify";
import { DocumentUploadState } from "../../constants/DocumentUploadState";
import { ProcessDocumentScreen } from "../ProcessDocumentScreen";
import { QueueType } from "../../constants/QueueState";
import { errorMessageHandling, CONSTANTS } from "@govtechsg/tradetrust-utils";

export const RevokeContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const [revokeDocuments, setRevokeDocuments] = useState([]);
  const [fileName, setFileName] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [revokeStep, setRevokeStep] = useState(1);
  const [documentUploadState, setDocumentUploadState] = useState(DocumentUploadState.INITIALIZED);

  useEffect(() => {
    if (revokeDocuments.length > 0) {
      const isDocumentRevokable = utils.isDocumentRevokable(revokeDocuments[0]);

      const validateDocument = async () => {
        const network = config?.network || "";
        let errors = [] as string[];

        if (network !== "local") {
          const verify = verificationBuilder(openAttestationVerifiers, { network: network });

          const fragments = await verify(revokeDocuments[0]);

          errors = errorMessageHandling(fragments);
        }

        if (errors.length > 0) {
          setErrorMessages(errors.map((error) => CONSTANTS.MESSAGES[error].failureMessage));
          setRevokeDocuments([]);
          setDocumentUploadState(DocumentUploadState.ERROR);
        } else {
          setErrorMessages([]);
          setRevokeStep(2);
          setDocumentUploadState(DocumentUploadState.DONE);
        }
      };

      if (!isDocumentRevokable) {
        setErrorMessages(["Document is not revokable, please use a revokable document"]);
        setRevokeDocuments([]);
        setDocumentUploadState(DocumentUploadState.ERROR);
      } else {
        validateDocument();
      }
    }
  }, [config?.network, revokeDocuments]);

  if (!config) {
    return <Redirect to="/" />;
  }

  const revokingDocument = () => {
    setRevokeStep(3);
    setShowConfirmationModal(false);
  };
  const revokeAnotherDocument = () => {
    setRevokeStep(1);
    setRevokeDocuments([]);
    setFileName("");
    setErrorMessages([]);
    setShowConfirmationModal(false);
    setDocumentUploadState(DocumentUploadState.INITIALIZED);
  };

  return (
    <>
      <RevokeConfirmationModal
        fileName={fileName}
        revokingDocument={revokingDocument}
        show={showConfirmationModal}
        closeRevokeConfirmationModal={() => setShowConfirmationModal(false)}
      />
      {revokeStep === 1 && (
        <RevokeDocumentDropZone
          setRevokeDocuments={setRevokeDocuments}
          errorMessages={errorMessages}
          setErrorMessages={setErrorMessages}
          setFileName={setFileName}
          documentUploadState={documentUploadState}
          setDocumentUploadState={setDocumentUploadState}
        />
      )}
      {revokeStep === 2 && (
        <RevokeDocumentTileArea
          revokeDocuments={revokeDocuments}
          fileName={fileName}
          onShowConfirmation={() => setShowConfirmationModal(true)}
          documentUploadState={documentUploadState}
          onBack={revokeAnotherDocument}
        />
      )}
      {revokeStep === 3 && (
        <ProcessDocumentScreen
          config={config}
          revokeDocuments={revokeDocuments}
          processAnotherDocument={revokeAnotherDocument}
          fileName={fileName}
          type={QueueType.REVOKE}
        />
      )}
    </>
  );
};
