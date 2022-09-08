import React, { FunctionComponent, useState } from "react";
import { Button, ButtonDVP } from "../../UI/Button";
import { useAuthContext } from "../../../common/contexts/AuthenticationContext";
import { useConfigContext } from "../../../common/contexts/config";
import { usePersistedConfigFile } from "../../../common/hooks/usePersistedConfigFile";

export const LogoutButton: FunctionComponent<ButtonDVP> = (props) => {
  const { logout } = useAuthContext();
  const { setConfig } = useConfigContext();
  const { setConfigFile } = usePersistedConfigFile();
  const [isLoading, setIsLoading] = useState(false);

  const logUserOut = async () => {
    setIsLoading(true);
    await logout();
    setConfig();
    setConfigFile();
  };

  return (
    <div data-testid="logout-button">
      <Button loading={isLoading} onClick={logUserOut} {...props}>
        Logout
      </Button>
    </div>
  );
};
