import { FunctionComponent } from "react";
import { DynamicForm } from "./DynamicForm";

import sample from "../../../test/fixture/config/v2/sample-config-ropsten.json";

export default {
  title: "DynamicForm/DynamicForm",
  component: DynamicForm,
  parameters: {
    componentSubtitle: "DynamicForm.",
  },
};

const mockFormData = {
  fileName: "document-1",
  data: { formData: {} },
  templateIndex: 0,
  ownership: { holderAddress: "", beneficiaryAddress: "" },
  extension: "tt",
};

export const Ebl: FunctionComponent = () => {
  const sampleForm = sample.forms[1];
  const formEbl = { ...sampleForm };

  return (
    <DynamicForm
      schema={formEbl.schema}
      uiSchema={formEbl.uiSchema}
      form={mockFormData}
      setFormData={() => {}}
      setOwnership={() => {}}
      setCurrentForm={() => {}}
      attachmentAccepted={true}
      type={sampleForm.type as any}
    />
  );
};

export const Invoice: FunctionComponent = () => {
  const sampleForm = sample.forms[4];
  const formInvoice = { ...sampleForm };

  return (
    <DynamicForm
      schema={formInvoice.schema}
      uiSchema={formInvoice.uiSchema}
      form={mockFormData}
      setFormData={() => {}}
      setOwnership={() => {}}
      setCurrentForm={() => {}}
      attachmentAccepted={true}
      type={sampleForm.type as any}
    />
  );
};

export const Coo: FunctionComponent = () => {
  const sampleForm = sample.forms[0];
  const formCoo = { ...sampleForm };

  return (
    <DynamicForm
      schema={formCoo.schema}
      uiSchema={formCoo.uiSchema}
      form={mockFormData}
      setFormData={() => {}}
      setOwnership={() => {}}
      setCurrentForm={() => {}}
      attachmentAccepted={true}
      type={sampleForm.type as any}
    />
  );
};

export const CoverLetter: FunctionComponent = () => {
  const sampleForm = sample.forms[2];
  const formCoverLetter = { ...sampleForm };

  return (
    <DynamicForm
      schema={formCoverLetter.schema}
      uiSchema={formCoverLetter.uiSchema}
      form={mockFormData}
      setFormData={() => {}}
      setOwnership={() => {}}
      setCurrentForm={() => {}}
      attachmentAccepted={true}
      type={sampleForm.type as any}
    />
  );
};
