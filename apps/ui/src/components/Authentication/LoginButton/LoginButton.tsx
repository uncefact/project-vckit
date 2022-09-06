import React, { FunctionComponent, useState } from "react";
import { Button, ButtonDVP } from "../../UI/Button";
import { useAuthContext } from "../../../common/contexts/AuthenticationContext";

export const LoginButton: FunctionComponent<ButtonDVP> = (props) => {
  const { login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const logUserIn = (): void => {
    setIsLoading(true);
    const email = prompt("Please enter your email to login") ?? "";
    login(email).catch(() => {
      setIsLoading(false);
    });
  };

  return (
    <div data-testid="login-button">
      <Button loading={isLoading} onClick={logUserIn} {...props}>
        Login
      </Button>
    </div>
  );
};
