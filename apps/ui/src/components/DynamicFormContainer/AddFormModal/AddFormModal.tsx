import { FunctionComponent } from "react";
import { Button, ButtonVariant } from "../../UI/Button";
import { FormTemplate } from "../../../types";
import { ModalDialog } from "../../ModalDialog";
import { FormSelect } from "../../FormSelectionContainer/FormSelect";

interface AddFormModalProps {
  onAdd: (index: number) => void;
  show: boolean;
  onClose: () => void;
  forms: FormTemplate[];
}

export const AddFormModal: FunctionComponent<AddFormModalProps> = ({ onAdd, show, onClose, forms }) => {
  if (!show) {
    return null;
  }

  const onAddForm = (formIndex: number) => {
    onAdd(formIndex);
    onClose();
  };

  return (
    <ModalDialog className="mx-3 max-w-xl md:mx-0" close={onClose}>
      <h2 className="mb-6">Add New Document</h2>
      <h4 className="mb-8">Choose Document Type to Issue</h4>
      <div className="flex flex-wrap justify-start">
        {forms.map((form: FormTemplate, index: number) => {
          return (
            <div key={`modal-form-select-${index}`} className="w-full md:w-1/3 mb-8 flex justify-center">
              <FormSelect
                id={`modal-form-select-${index}`}
                form={form}
                onAddForm={() => onAddForm(index)}
                data-testid={`add-form-button-${index}`}
              />
            </div>
          );
        })}
      </div>
      <Button
        data-testid="cancel-add-form-button"
        onClick={onClose}
        className="flex mx-auto"
        variant={ButtonVariant.ERROR}
      >
        Cancel
      </Button>
    </ModalDialog>
  );
};
