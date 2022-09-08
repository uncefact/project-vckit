import React, { FunctionComponent } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthContext } from "../../common/contexts/AuthenticationContext";
import { RouteInterface } from "../../routes";

export const PrivateRoute: FunctionComponent<RouteInterface> = (routeProps: RouteInterface) => {
  const { isLoggedIn } = useAuthContext();

  return isLoggedIn ? <Route {...routeProps} /> : <Redirect to="/" />;
};
