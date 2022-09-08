import { FunctionComponent, useState } from "react";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";
import { RevokeDocumentTileArea } from "./RevokeDocumentTileArea";
import { MemoryRouter } from "react-router";

export default {
  title: "Revoke/RevokeDocumentTileArea",
  component: RevokeDocumentTileArea,
  parameters: {
    componentSubtitle: "RevokeDocumentTileArea",
  },
};

export const Default: FunctionComponent = () => {
  const revokeDocuments = [document] as any[];
  const [] = useState(false);
  const onShowConfirmation = () => {
    console.log("show Confirmation!");
  };
  const onBack = () => {
    console.log("back!");
  };

  return (
    <MemoryRouter>
      <RevokeDocumentTileArea
        revokeDocuments={revokeDocuments}
        fileName="document-1.tt"
        onShowConfirmation={onShowConfirmation}
        documentUploadState={DocumentUploadState.DONE}
        onBack={onBack}
      />
    </MemoryRouter>
  );
};
