import { ProgressBar } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/contexts/forms";
import { Config, FormTemplate } from "../../../types";
import { Wrapper } from "../../UI/Wrapper";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
import { Card } from "../../UI/Card";
import { ContentFrame } from "../../UI/ContentFrame";
import { FormSelect } from "../FormSelect";

interface FormSelection {
  config: Config;
}

export const FormSelection: FunctionComponent<FormSelection> = ({ config }) => {
  const { activeFormIndex, newForm } = useFormsContext();

  const onAddForm = (formIndex: number) => {
    newForm(formIndex);
  };

  // Once the active form has been set, redirect to /form
  // To get back to this page, the previous page has to unset the activeFormIndex first
  if (activeFormIndex !== undefined) return <Redirect to="/form" />;

  return (
    <Wrapper>
      <div className="mb-4">
        <IssueOrRevokeSelector />
      </div>
      <ContentFrame>
        <Card>
          <ProgressBar step={1} totalSteps={3} />
          <h3 data-testid="form-selection-title" className="my-10">
            Choose Document Type to Issue
          </h3>
          <div className="flex flex-wrap justify-start">
            {config.forms.map((form: FormTemplate, index: number) => {
              return (
                <div key={`form-select-${index}`} className="w-full md:w-1/3 mb-4">
                  <FormSelect id={`form-select-${index}`} form={form} onAddForm={() => onAddForm(index)} />
                </div>
              );
            })}
          </div>
        </Card>
      </ContentFrame>
    </Wrapper>
  );
};
