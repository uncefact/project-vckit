import React, { FunctionComponent } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/contexts/config";
import { FormSelection } from "./FormSelection";

export const FormSelectionContainer: FunctionComponent = () => {
  const { config } = useConfigContext();

  if (!config) {
    return <Redirect to="/" />;
  }

  return <FormSelection config={config} />;
};
