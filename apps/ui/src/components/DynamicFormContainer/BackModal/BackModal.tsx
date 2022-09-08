import React, { FunctionComponent } from "react";
import { ConfirmModal } from "../../ConfirmModal";

interface BackModalProps {
  backToFormSelection: () => void;
  show: boolean;
  closeBackModal: () => void;
}

export const BackModal: FunctionComponent<BackModalProps> = ({ backToFormSelection, show, closeBackModal }) => {
  return (
    <ConfirmModal
      show={show}
      title="Clear All"
      description={
        <span>
          Do you want to clear all? This will delete <b>ALL</b> your current document(s).
        </span>
      }
      onClose={closeBackModal}
      onConfirm={backToFormSelection}
      onConfirmText={"Delete"}
    />
  );
};
