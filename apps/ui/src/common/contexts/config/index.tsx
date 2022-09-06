import React, { useState, useContext, createContext, FunctionComponent } from "react";
import { Config } from "../../../types";

interface ConfigContext {
  config?: Config;
  setConfig: (config?: Config) => void;
}

export const ConfigContext = createContext<ConfigContext>({
  config: undefined,
  setConfig: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useConfigContext = (): ConfigContext => useContext<ConfigContext>(ConfigContext);

export const ConfigContextProvider: FunctionComponent = ({ children }) => {
  const [config, setConfig] = useState<Config>();

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
