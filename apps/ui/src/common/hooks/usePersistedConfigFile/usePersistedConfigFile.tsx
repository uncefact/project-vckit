import createPersistedState from "use-persisted-state";
import { ConfigFile } from "../../../types";

const useConfigFile = createPersistedState("CONFIG_FILE");

export const usePersistedConfigFile = (): {
  configFile?: ConfigFile;
  setConfigFile: (configFile?: ConfigFile) => void;
} => {
  // Using empty object to initialize config file due to bug with deserializing "undefined"
  const [configFileFromStorage, setConfigFileInStorage] = useConfigFile<ConfigFile | Record<string, null>>({});
  const configFile =
    Object.keys(configFileFromStorage).length === 0 ? undefined : (configFileFromStorage as ConfigFile);
  const setConfigFile = (config?: ConfigFile): void => {
    setConfigFileInStorage(config ? config : {});
  };
  return { configFile, setConfigFile };
};
