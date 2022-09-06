import { Dropdown, DropdownItem } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { useFormsContext } from "../../../common/contexts/forms";

interface DocumentSelectorProps {
  validateCurrentForm: () => boolean;
  closePreviewMode: () => void;
}

export const DocumentSelector: FunctionComponent<DocumentSelectorProps> = ({
  validateCurrentForm,
  closePreviewMode,
}) => {
  const { forms, setActiveFormIndex, activeFormIndex, currentForm } = useFormsContext();

  const selectDocument = (formIndex: number): void => {
    if (isNaN(formIndex)) return;
    if (activeFormIndex === undefined || formIndex > forms.length) return;
    if (validateCurrentForm()) setActiveFormIndex(formIndex - 1);
    closePreviewMode();
  };

  const activeDocumentNumber = activeFormIndex ? activeFormIndex + 1 : 1;

  return (
    <div>
      <div className="flex items-center">
        <input
          data-testid="document-number-input"
          value={activeDocumentNumber}
          onChange={(e) => {
            selectDocument(parseInt(e.target.value));
          }}
          type="text"
          className="flex rounded border border-solid border-gray-300 h-10 w-10 text-center"
        />
        <div>&nbsp;of {forms.length} document(s)</div>
      </div>
      <div>
        <Dropdown
          data-testid="document-name-select"
          className="border border-cloud-200 rounded p-2 mt-3 mb-1 w-64"
          dropdownButtonText={currentForm?.fileName || ""}
        >
          {forms.map((form, formIndex) => {
            const documentNumber = formIndex + 1;
            return (
              <DropdownItem
                className="w-64"
                onClick={() => selectDocument(documentNumber)}
                key={`${form.fileName}-${documentNumber}`}
              >
                {form.fileName}
              </DropdownItem>
            );
          })}
        </Dropdown>
      </div>
    </div>
  );
};
