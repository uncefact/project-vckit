import React from "react";
import { render, screen } from "@testing-library/react";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { useAuthContext } from "../../common/contexts/AuthenticationContext/AuthContext";
import { PrivateRoute } from "./";

jest.mock("../../common/contexts/AuthenticationContext/AuthContext");
const mockUseAuthContext = useAuthContext as jest.Mock;

const Private = () => <div>Private</div>;
const Public = () => <div>Public</div>;

describe("private route", () => {
  it("should render public by default", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    render(
      <Router history={history}>
        <Switch>
          <PrivateRoute exact path="/private">
            <Private />
          </PrivateRoute>
          <Route exact path="/">
            <Public />
          </Route>
        </Switch>
      </Router>
    );

    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  it("should render public if attempt to private", () => {
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
    });

    const history = createMemoryHistory({ initialEntries: ["/private"] });

    render(
      <Router history={history}>
        <Switch>
          <PrivateRoute exact path="/private">
            <Private />
          </PrivateRoute>
          <Route exact path="/">
            <Public />
          </Route>
        </Switch>
      </Router>
    );

    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  it("should render private if authenticated", () => {
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
    });

    const history = createMemoryHistory({ initialEntries: ["/private"] });

    render(
      <Router history={history}>
        <Switch>
          <PrivateRoute exact path="/private">
            <Private />
          </PrivateRoute>
          <Route exact path="/">
            <Public />
          </Route>
        </Switch>
      </Router>
    );

    expect(screen.getByText("Private")).toBeInTheDocument();
  });
});
