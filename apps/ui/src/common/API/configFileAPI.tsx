import axios from "axios";
import { Config } from "../../types";
import { VCKIT_API, CONFIG_FILE_ROUTE } from "../../appConfig";

interface ConfigFileData {
  document: Config;
}

export const getConfigFile = async (id: string): Promise<ConfigFileData> => {
  try {
    const axiosResponse = await axios.get(`${VCKIT_API}/${CONFIG_FILE_ROUTE}/${id}`);
    return axiosResponse.data.data;
  } catch (err) {
    throw err;
  }
};
