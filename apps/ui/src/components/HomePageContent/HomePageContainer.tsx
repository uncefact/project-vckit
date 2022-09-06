import React from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import {
  resetCertificateState,
  retrieveCertificateByAction,
  retrieveCertificateByActionFailure,
  updateCertificate,
} from "../../reducers/certificate";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { NestedDocumentState } from "../../constants/NestedDocumentState";
import { getLogger } from "../../utils/logger";

import { WelcomeSection } from "./WelcomeSection";
import { MainBenefitsSection } from "./MainBenefitsSection";
import { HowItWorksSection } from "./HowItWorksSection";

const { error } = getLogger("component:mainpage");

const SHOW_BENEFITS_SECTION = false;
const SHOW_HOW_IT_WORKS_SECTION = false;

export const HomePageContainer = (): React.ReactElement => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const loadCertificate = React.useCallback((payload: any) => dispatch(updateCertificate(payload)), [dispatch]);
  // event listener for any custom postMessage
  window.addEventListener("message", (event) => {
    if (event.data.type === NestedDocumentState.LOAD) {
      try {
        const doc = atob(event.data.payload);
        loadCertificate(JSON.parse(doc));
        history.push("/verify");
      } catch (e) {
        error("decode data not json: " + e);
      }
    }
  });
  React.useEffect(() => {
    if (location.search !== "") {
      const queryParams = queryString.parse(location.search);
      const anchorStr = decodeURIComponent(location.hash.substr(1));
      const anchor = anchorStr ? JSON.parse(anchorStr) : {};
      dispatch(resetCertificateState());
      const action = JSON.parse(queryParams.q as string);
      if (action.type === "DOCUMENT") {
        dispatch(retrieveCertificateByAction(action.payload, anchor));
      } else {
        dispatch(
          retrieveCertificateByActionFailure(`The type ${action.type} provided from the action is not supported`)
        );
      }
      history.push("/verify");
    }
  }, [dispatch, location, history]);
  return (
    <div className="text-lg">
      <WelcomeSection />
      {SHOW_BENEFITS_SECTION && <MainBenefitsSection />}
      {SHOW_HOW_IT_WORKS_SECTION && <HowItWorksSection />}
    </div>
  );
};
