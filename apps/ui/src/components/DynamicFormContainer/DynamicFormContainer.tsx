import React, { FunctionComponent } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/contexts/config";
import { DynamicFormLayout } from "./DynamicFormLayout";

export const DynamicFormContainer: FunctionComponent = () => {
  const { config } = useConfigContext();

  if (!config) {
    return <Redirect to="/" />;
  }
  return <DynamicFormLayout />;
};
