import { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/contexts/config";
import { useFormsContext } from "../../common/contexts/forms";
import { ProcessDocumentScreen } from "../ProcessDocumentScreen";
import { QueueType } from "../../constants/QueueState";

export const PublishContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { forms, currentForm, setForms, setActiveFormIndex } = useFormsContext();

  if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;

  const onCreateAnotherDocument = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
  };

  return (
    <ProcessDocumentScreen
      config={config}
      forms={forms}
      processAnotherDocument={onCreateAnotherDocument}
      type={QueueType.ISSUE}
    />
  );
};
