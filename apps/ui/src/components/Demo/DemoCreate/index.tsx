import React, { FunctionComponent, useContext, useState } from "react";
import { ReactNode } from "react-markdown";
import { DemoCreateContext } from "./contexts/DemoCreateContext";
import { Prompt } from "react-router";
import { useHistory } from "react-router-dom";
import { Location } from "history";
import { useOverlayContext } from "@govtechsg/tradetrust-ui-components";
import { DemoCreateForm } from "./DemoCreateForm";
import { DemoCreateHeader } from "./DemoCreateHeader";
import { DemoCreateIssue } from "./DemoCreateIssue";
import { DemoCreateReview } from "./DemoCreateReview";
import { DemoCreateStart } from "./DemoCreateStart";
import { ModalNavigateOut } from "../ModalNavigateOut";
import { gaEvent } from "../../../common/analytics";

export const DemoCreate: FunctionComponent = () => {
  const history = useHistory();
  const { activeStep } = useContext(DemoCreateContext);
  const { setOverlayVisible, showOverlay } = useOverlayContext();
  const [isOnNavigateOut, setOnNavigateOut] = useState(false);
  const when = activeStep !== "start" && activeStep !== "issue";

  const components: Record<string, ReactNode> = {
    form: <DemoCreateForm />,
    issue: <DemoCreateIssue />,
    review: <DemoCreateReview />,
    start: <DemoCreateStart />,
  };

  const closeModal = () => {
    setOverlayVisible(false);
    showOverlay(undefined);
  };

  const handlePrompt = (location: Location) => {
    if (!isOnNavigateOut) {
      setOverlayVisible(true);
      showOverlay(
        <ModalNavigateOut
          closeModal={closeModal}
          closeModalAndNavigate={() => {
            closeModal();
            history.push(location.pathname);
            gaEvent({
              action: "magic_demo_drop_off",
              category: "magic_demo",
            });
          }}
          setOnNavigateOut={setOnNavigateOut}
        />
      );
      return false;
    }
    return true;
  };

  return (
    <>
      <Prompt when={when} message={handlePrompt} />
      <DemoCreateHeader />
      {components[activeStep]}
    </>
  );
};
