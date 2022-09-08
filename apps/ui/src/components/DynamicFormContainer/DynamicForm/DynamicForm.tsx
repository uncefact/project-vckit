import { cloneDeep, debounce } from "lodash";
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Form from "@rjsf/core";
import { useFormsContext } from "../../../common/contexts/forms";
import { FileUploadType, FormEntry, FormTemplate, FormType, Ownership, SetFormParams } from "../../../types";
import { DataFileButton } from "../DataFileButton";
import { DocumentNameInput } from "../DocumentNameInput";
import { TransferableRecordForm } from "../TransferableRecordForm";
import { AttachmentDropzone } from "./AttachmentDropzone";
import {
  CustomFieldTemplate,
  CustomObjectFieldTemplate,
  CustomArrayFieldTemplate,
  CustomTextareaWidget,
  CustomDropdownWidget,
  CustomColorWidget,
  CustomFileWidget,
  CustomVCUploadWidget,
  CustomWatermarkPreviewWidget,
} from "./CustomTemplates";

export interface DynamicFormProps {
  schema: FormTemplate["schema"];
  attachmentAccepted: boolean;
  attachmentAcceptedFormat?: string;
  form: FormEntry;
  className?: string;
  type: FormType;
  setFormData: (formData: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  setOwnership: (ownership: Ownership) => void;
  setCurrentForm: (arg: SetFormParams) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  uiSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  fileName?: string;
}

export const DynamicForm: FunctionComponent<DynamicFormProps> = ({
  schema,
  uiSchema,
  form,
  setFormData,
  setOwnership,
  setCurrentForm,
  className,
  attachmentAccepted,
  type,
  fileName,
  attachmentAcceptedFormat = "",
}) => {
  const { templateIndex, data, ownership } = form;
  const { newPopulatedForm, currentForm, setCurrentFileName } = useFormsContext();
  const isTransferableRecord = type === "TRANSFERABLE_RECORD";

  const [newFileName, setNewFileName] = useState(currentForm?.fileName);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      setNewFileName(currentForm?.fileName);
    }
  }, [currentForm?.fileName]);

  const debouncedChange = useMemo(
    () =>
      debounce((val) => {
        setCurrentFileName(val);
      }, 400),
    [setCurrentFileName]
  );

  const handleChangeFileName = useCallback(
    (e) => {
      setNewFileName(e.target.value);
      debouncedChange(e.target.value);
    },
    [debouncedChange]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeFormValue = (value: any): void => {
    // If value is an array, call function from forms index to append
    // multiple docs of the current form's templateIndex
    if (Array.isArray(value)) {
      newPopulatedForm(templateIndex, value, fileName);
    } else {
      // But if it's just one object, we'll replace the values of the existing form (i.e. original behaviour)
      setCurrentForm({
        data: { ...data, formData: value?.data || data.formData },
        updatedOwnership: value?.ownership,
        fileName,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setAttachments = (attachments: any): void => {
    const currentFormData = cloneDeep(data.formData);
    setFormData({
      ...data,
      formData: { ...currentFormData, attachments },
    });
  };

  const handleUpload = (processedFiles: FileUploadType[]): void => {
    const attachedFile = data.formData.attachments || [];
    const nextAttachment = [...attachedFile, ...processedFiles];

    setAttachments(nextAttachment);
  };

  const handleRemoveUpload = (fileIndex: number): void => {
    const nextAttachment = data.formData.attachments.filter(
      (_file: FileUploadType, index: number) => index !== fileIndex
    );

    setAttachments(nextAttachment);
  };

  const widgets = {
    TextareaWidget: CustomTextareaWidget,
    SelectWidget: CustomDropdownWidget,
    ColorWidget: CustomColorWidget,
    FileWidget: CustomFileWidget,
    VCWidget: CustomVCUploadWidget,
    WatermarkPreviewWidget: CustomWatermarkPreviewWidget,
  };

  return (
    <div className={`${className}`}>
      <div className="mb-10">
        <DataFileButton onDataFile={mergeFormValue} schema={schema} />
      </div>
      <DocumentNameInput onChange={handleChangeFileName} value={newFileName} />
      {isTransferableRecord && (
        <TransferableRecordForm
          beneficiaryAddress={ownership.beneficiaryAddress}
          holderAddress={ownership.holderAddress}
          setBeneficiaryAddress={(beneficiaryAddress) =>
            setOwnership({
              beneficiaryAddress,
              holderAddress: ownership.holderAddress,
            })
          }
          setHolderAddress={(holderAddress) =>
            setOwnership({
              beneficiaryAddress: ownership.beneficiaryAddress,
              holderAddress,
            })
          }
        />
      )}
      <Form
        className="form-custom"
        schema={schema}
        uiSchema={uiSchema}
        onChange={setFormData}
        formData={data?.formData}
        widgets={widgets}
        ObjectFieldTemplate={CustomObjectFieldTemplate}
        FieldTemplate={CustomFieldTemplate}
        ArrayFieldTemplate={CustomArrayFieldTemplate}
      />

      {attachmentAccepted && (
        <AttachmentDropzone
          acceptedFormat={attachmentAcceptedFormat}
          onUpload={handleUpload}
          onRemove={handleRemoveUpload}
          uploadedFiles={data?.formData?.attachments}
        />
      )}
    </div>
  );
};
