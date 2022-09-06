import React, { FunctionComponent, useState, useEffect } from "react";
import { assertConfigFile } from "../../../common/config/validate";
import { usePersistedConfigFile } from "../../../common/hooks/usePersistedConfigFile";
import { useConfigContext } from "../../../common/contexts/config";
import { useAuthContext } from "../../../common/contexts/AuthenticationContext";
import { ConfigFile } from "../../../types";
import { Wrapper } from "../../UI/Wrapper";
import { ConfigFileDropZone } from "./ConfigFileDropZone";
import { LoadingModal } from "../../UI/Overlay/LoadingModal";
import { CONFIG_FILE_ID } from "../../../appConfig";
import { getConfigFile } from "../../../common/API/configFileAPI";

const loadingTitle = "Populating Config File";
const loadingMessage = "One moment, we are just fetching your config file.";
const getConfigFileErrorMessage = "Unable to retrieve your remote config file. Please manually upload a config file.";

export const ConfigFileDropZoneContainer: FunctionComponent = () => {
  const [configValidationError, setConfigValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setConfigFile } = usePersistedConfigFile();
  const { config, setConfig } = useConfigContext();
  const { isLoggedIn } = useAuthContext();

  const populateConfigFile = async (): Promise<void> => {
    try {
      const { document } = (await getConfigFile(CONFIG_FILE_ID)) ?? {};
      if (document) {
        setConfig(document);
      }
    } catch (err: any) {
      setConfigValidationError(getConfigFileErrorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !config) {
      (async () => {
        setIsLoading(true);
        await populateConfigFile();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const onConfigFile = async (configFileFromDropZone: ConfigFile): Promise<void> => {
    try {
      assertConfigFile(configFileFromDropZone);
      setConfigFile(configFileFromDropZone);
      setConfigValidationError("");
    } catch (e) {
      if (e instanceof Error) {
        setConfigValidationError(`Config is malformed: ${e.message}`);
      }
    }
  };

  return (
    <Wrapper>
      {isLoading ? <LoadingModal title={loadingTitle} content={loadingMessage} /> : ""}
      <ConfigFileDropZone errorMessage={configValidationError} onConfigFile={onConfigFile} />
    </Wrapper>
  );
};
