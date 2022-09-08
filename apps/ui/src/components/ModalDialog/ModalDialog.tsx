import React, { FunctionComponent } from "react";
import { useLockBodyScroll } from "../../common/hooks/useLockBodyScroll";

interface ModalDialogProps {
  close: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const ModalDialog: FunctionComponent<ModalDialogProps> = ({ close, children, className }) => {
  useLockBodyScroll();

  return (
    <>
      <div
        className="flex w-full h-full fixed justify-center items-center z-20 top-0 left-0"
        data-testid="modal-dialog"
      >
        <div className={`${className ? `${className} ` : ""}relative z-30 max-w-sm bg-white p-6 rounded-xl`}>
          {children}
        </div>
        <div
          className="fixed z-20 top-0 left-0 w-full h-full bg-black bg-opacity-70"
          data-testid="modal-backdrop"
          onClick={() => close()}
        />
      </div>
    </>
  );
};
