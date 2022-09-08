import React, { FunctionComponent } from "react";
import { ConfigFileDropZone } from "./ConfigFileDropZone";
export default {
  title: "Home/ConfigFileDropZone",
  component: ConfigFileDropZone,
  parameters: {
    componentSubtitle: "ConfigFileDropZone.",
  },
};

export const Default: FunctionComponent = () => (
  <ConfigFileDropZone onConfigFile={(configFile) => console.log(JSON.stringify(configFile, null, 2))} />
);

export const WithError: FunctionComponent = () => (
  <ConfigFileDropZone
    errorMessage="Config file is malformed"
    onConfigFile={(configFile) => console.log(JSON.stringify(configFile, null, 2))}
  />
);
