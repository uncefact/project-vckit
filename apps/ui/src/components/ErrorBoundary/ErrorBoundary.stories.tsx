import { createBrowserHistory } from "history";
import React, { FunctionComponent } from "react";
import { Router } from "react-router-dom";
import { ErrorBoundary, ErrorBoundaryRenderer } from "./ErrorBoundary";

const history = createBrowserHistory();

export default {
  title: "Error/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    componentSubtitle: "Shown when child has errors.",
  },
};

const ErrorComponent: FunctionComponent = () => {
  throw new Error(
    "Error!! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  );
};

const MockRenderer: ErrorBoundaryRenderer = () => <div>Error Renderer</div>;

export const Default = () => {
  return (
    <Router history={history}>
      <ErrorBoundary renderer={MockRenderer}>
        <ErrorComponent />
      </ErrorBoundary>
    </Router>
  );
};
