import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/contexts/config";
import { usePersistedConfigFile } from "../../common/hooks/usePersistedConfigFile";
import { ConfigFileDropZoneContainer } from "./ConfigFileDropZone";
import { WalletDecryptionContainer } from "./WalletDecryption/WalletDecryptionContainer";

export const HomeContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { configFile } = usePersistedConfigFile();

  // If wallet has been decrypted, redirect to forms
  if (config) return <Redirect to="/forms-selection" />;

  return configFile ? <WalletDecryptionContainer /> : <ConfigFileDropZoneContainer />;
};
