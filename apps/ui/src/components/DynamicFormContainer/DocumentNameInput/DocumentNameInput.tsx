import { ChangeEventHandler, FunctionComponent } from "react";

interface DocumentNameInputProps {
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const DocumentNameInput: FunctionComponent<DocumentNameInputProps> = ({ value = "", onChange }) => {
  return (
    <div className="mb-16">
      <label>Document Name</label>
      <input
        onChange={onChange}
        data-testid="file-name-input"
        type="text"
        aria-label="file-name-input"
        value={value}
        className={`custom-input`}
      />
    </div>
  );
};
