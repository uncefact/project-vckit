import { ProgressBar } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useContext } from "react";
import { DemoCreateButtonRow } from "../DemoCreateButtonRow";
import { DemoCreateContext } from "../contexts/DemoCreateContext";
import { DemoCreateFormItem } from "./DemoCreateFormItem";
import { schema } from "./schema";
import { FormItemSchema } from "./types";
import { DemoFormContext } from "../contexts/DemoFormContext";

export const DemoCreateForm: FunctionComponent = () => {
  const { setActiveStep } = useContext(DemoCreateContext);

  const { formValues, setFormValues } = useContext(DemoFormContext);

  const handleChange = (name: string, value: string) => {
    // parse name
    let keys = name.split(".");
    let obj = formValues;

    while (keys.length > 1) {
      obj = obj[keys[0]];
      keys = keys.slice(1);
    }

    obj[keys[0]] = value;

    setFormValues(formValues);
  };

  const handleBack = () => {
    setActiveStep("start");
  };

  const handleNext = () => {
    setActiveStep("review");
  };

  return (
    <>
      <ProgressBar totalSteps={3} step={1} />
      <div className="my-4">
        <h3 className="my-3">Fill in Details of CoO</h3>
        <p>The form is already pre-filled for your convenience, feel free to make changes if needed. </p>
      </div>
      <div>
        {Object.entries(schema).map(([formItemName, formItem], index) => {
          return (
            <DemoCreateFormItem
              key={formItemName}
              onChange={handleChange}
              formItemName={formItemName}
              formItem={formItem as FormItemSchema}
              formItemIndex={index}
              data={formValues}
            />
          );
        })}
      </div>
      <DemoCreateButtonRow onBack={handleBack} onNext={handleNext} />
    </>
  );
};
