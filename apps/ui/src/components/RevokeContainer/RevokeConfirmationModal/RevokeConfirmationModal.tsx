import { FunctionComponent } from "react";
import { ConfirmModal } from "../../ConfirmModal";

interface RevokeConfirmationModalProps {
  revokingDocument: () => void;
  show: boolean;
  closeRevokeConfirmationModal: () => void;
  fileName: string;
}

export const RevokeConfirmationModal: FunctionComponent<RevokeConfirmationModalProps> = ({
  revokingDocument,
  show,
  closeRevokeConfirmationModal,
  fileName,
}) => {
  return (
    <ConfirmModal
      title="Revoke Document"
      description={
        <div className="my-2">
          <div className="text-center mb-4">You are about to revoke the following file. This step is irreversible.</div>
          <div className="text-center">{fileName}</div>
        </div>
      }
      onClose={closeRevokeConfirmationModal}
      onConfirm={revokingDocument}
      onConfirmText="Revoke"
      show={show}
    />
  );
};
