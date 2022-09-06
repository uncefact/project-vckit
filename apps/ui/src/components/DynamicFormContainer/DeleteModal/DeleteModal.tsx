import React, { FunctionComponent } from "react";
import { ConfirmModal } from "../../ConfirmModal";

interface DeleteModalProps {
  deleteForm: () => void;
  show: boolean;
  closeDeleteModal: () => void;
}

export const DeleteModal: FunctionComponent<DeleteModalProps> = ({ deleteForm, show, closeDeleteModal }) => {
  return (
    <ConfirmModal
      title="Delete Form"
      description="Are you sure you want to delete this form?"
      onClose={closeDeleteModal}
      onConfirm={deleteForm}
      onConfirmText="Delete"
      show={show}
    />
  );
};
