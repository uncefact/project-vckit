import React, { render, screen, waitFor, act } from "@testing-library/react";
import { ConfigFileDropZoneContainer } from "./ConfigFileDropZoneContainer";
import { useAuthContext } from "../../../common/contexts/AuthenticationContext/AuthContext";
import { useConfigContext } from "../../../common/contexts/config";
import { getConfigFile } from "../../../common/API/configFileAPI";
import { CONFIG_FILE_ID } from "../../../appConfig";

jest.mock("../../../appConfig", () => ({
  CONFIG_FILE_ID: "testID",
}));

jest.mock("../../../common/contexts/AuthenticationContext/AuthContext");
jest.mock("../../../common/contexts/config");
jest.mock("../../../common/API/configFileAPI");

const mockUseAuthContext = useAuthContext as jest.Mock;
const mockuseConfigContext = useConfigContext as jest.Mock;
const mockGetConfigFile = getConfigFile as jest.Mock;

mockUseAuthContext.mockReturnValue({ isLoggedIn: true });

const mockedSetConfig = jest.fn();
mockuseConfigContext.mockReturnValue({ setConfig: mockedSetConfig, config: "" });

const configFile = { document: { test: "configFile" } };
mockGetConfigFile.mockResolvedValue(configFile);

describe("ConfigFileDropZoneContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("documentation link for config-file should be correct and open in new tab", () => {
    render(<ConfigFileDropZoneContainer />);
    const docLink = screen.getByText("Don’t have a config file? Learn how to create one");
    expect(docLink.getAttribute("target")).toBe("_blank");
    expect(docLink.getAttribute("href")).toBe(
      "https://docs.tradetrust.io/docs/document-creator/config-file/config-generator"
    );
  });

  it("should fetch/store config file if user is logged in and configFile is not set", async () => {
    await act(async () => {
      render(<ConfigFileDropZoneContainer />);
    });

    expect(mockGetConfigFile).toBeCalledTimes(1);
    expect(mockGetConfigFile).toBeCalledWith(CONFIG_FILE_ID);

    await waitFor(() => {
      expect(mockedSetConfig).toBeCalledTimes(1);
      expect(mockedSetConfig).toBeCalledWith(configFile.document);
    });
  });

  it("should display loading modal when fetching a config file", async () => {
    await act(async () => {
      render(<ConfigFileDropZoneContainer />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading-modal")).not.toBeNull();
    });
  });

  it("shouldn't fetch config file if user is not logged in", async () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false });

    await act(async () => {
      render(<ConfigFileDropZoneContainer />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-modal")).toBeNull();
    });

    expect(mockGetConfigFile).toBeCalledTimes(0);
  });

  it("shouldn't fetch config file if config file already exists", async () => {
    mockuseConfigContext.mockReturnValueOnce({ setConfig: mockedSetConfig, config: configFile.document });

    await act(async () => {
      render(<ConfigFileDropZoneContainer />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-modal")).toBeNull();
    });

    expect(mockGetConfigFile).toBeCalledTimes(0);
  });

  it("should show error message if it failed to fetch the config file", async () => {
    mockGetConfigFile.mockRejectedValueOnce(new Error("testError"));

    await act(async () => {
      render(<ConfigFileDropZoneContainer />);
    });

    expect(mockGetConfigFile).toBeCalledTimes(1);
    expect(mockedSetConfig).toBeCalledTimes(0);

    await waitFor(() => {
      expect(
        screen.queryByText(/Unable to retrieve your remote config file. Please manually upload a config file/)
      ).not.toBeNull();
    });
  });
});
