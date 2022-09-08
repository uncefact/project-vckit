import { OverlayContextProvider } from "@govtechsg/tradetrust-ui-components";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import AppContainer from "./AppContainer";
import { ProviderContextProvider } from "./common/contexts/provider";
import { TokenInformationContextProvider } from "./common/contexts/TokenInformationContext";
import { AuthProvider } from "./common/contexts/AuthenticationContext";
import "./index.css";
import { configureStore } from "./store";
import { Router } from "react-router-dom";
import { history } from "./history";
import { NETWORK_NAME } from "./config";
import { getChainInfoFromNetworkName, getSupportedChainInfo } from "./common/utils/chain-utils";
// import { gaPageView } from "./common/analytics";
import { ConfigContextProvider } from "./common/contexts/config";
import { FormsContextProvider } from "./common/contexts/forms";

const store = configureStore();

// Removing GA until further instructions
// history.listen(() => {
//   gaPageView({ action: "page_view" });
// });

const App = () => {
  return (
    <OverlayContextProvider>
      <ProviderContextProvider
        defaultChainId={getChainInfoFromNetworkName(NETWORK_NAME).chainId}
        networks={getSupportedChainInfo()}
      >
        <TokenInformationContextProvider>
          <AuthProvider>
            <Provider store={store}>
              <ConfigContextProvider>
                <FormsContextProvider>
                  <Router history={history}>
                    <AppContainer />
                  </Router>
                </FormsContextProvider>
              </ConfigContextProvider>
            </Provider>
          </AuthProvider>
        </TokenInformationContextProvider>
      </ProviderContextProvider>
    </OverlayContextProvider>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
