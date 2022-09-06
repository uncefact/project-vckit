import React from "react";

import { DemoCreateFormItem } from ".";
import { data } from "../data";

export default {
  title: "Demo/FormItem",
  component: DemoCreateFormItem,
  parameters: {
    componentSubtitle: "Various type for the form item in the demo form",
  },
};

export const FormItemAccordion = () => {
  return (
    <DemoCreateFormItem
      formItem={{
        type: "object",
        uiType: "accordion",
        title: "Form Item Accordion",
      }}
      formItemName=""
      onChange={() => {}}
      formItemIndex={1}
      data={data}
    />
  );
};

export const FormItemWithLabel = () => {
  return (
    <DemoCreateFormItem
      formItem={{
        type: "string",
        uiType: "withLabel",
        title: "Form Item With Label",
      }}
      formItemName=""
      onChange={() => {}}
      formItemIndex={1}
      data={data}
    />
  );
};

export const FormItemWithoutLabel = () => {
  return (
    <DemoCreateFormItem
      formItem={{
        type: "string",
        uiType: "withoutLabel",
        title: "Form Item Without Label",
      }}
      formItemName=""
      onChange={() => {}}
      formItemIndex={1}
      data={data}
    />
  );
};

export const FormItemUploadWithSignature = () => {
  return (
    <DemoCreateFormItem
      formItem={{
        type: "string",
        uiType: "upload",
        title: "Form Item as upload",
      }}
      formItemName="firstSignatoryAuthentication.signature"
      onChange={() => {}}
      formItemIndex={1}
      data={data}
    />
  );
};

export const FormItemUploadWithoutSignature = () => {
  return (
    <DemoCreateFormItem
      formItem={{
        type: "string",
        uiType: "upload",
        title: "Form Item as upload",
      }}
      formItemName=""
      onChange={() => {}}
      formItemIndex={1}
      data={data}
    />
  );
};
