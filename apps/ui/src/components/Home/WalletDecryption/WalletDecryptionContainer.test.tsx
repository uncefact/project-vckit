import { render } from "@testing-library/react";
import { WalletDecryptionContainer } from "./WalletDecryptionContainer";
import { useConfigContext } from "../../../common/contexts/config";
import { usePersistedConfigFile } from "../../../common/hooks/usePersistedConfigFile";

jest.mock("../../../common/contexts/config");
jest.mock("../../../common/hooks/usePersistedConfigFile");

const mockuseConfigContext = useConfigContext as jest.Mock;
const mockusePersistedConfigFile = usePersistedConfigFile as jest.Mock;

const mockedSetConfig = jest.fn();
mockuseConfigContext.mockReturnValue({ setConfig: mockedSetConfig, config: "" });

const configFile = { forms: "testConfigFileForm" };
mockusePersistedConfigFile.mockReturnValue({ configFile });

describe("walletDecryptionContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set configFile if persistantConfigFile exists and the wallet property is missing from persistantConfigFile", async () => {
    render(<WalletDecryptionContainer />);

    expect(mockedSetConfig).toBeCalledTimes(1);
    expect(mockedSetConfig).toBeCalledWith({ forms: configFile.forms });
  });

  it("shouldn't set configFile if persistantConfigFile doesn't exist", async () => {
    mockusePersistedConfigFile.mockReturnValueOnce({ configFile: "" });

    render(<WalletDecryptionContainer />);
    expect(mockedSetConfig).toBeCalledTimes(0);
  });

  it("shouldn't set configFile if wallet property exists", async () => {
    mockusePersistedConfigFile.mockReturnValueOnce({ configFile: { ...configFile, wallet: "testWallet" } });

    render(<WalletDecryptionContainer />);
    expect(mockedSetConfig).toBeCalledTimes(0);
  });

  it("shouldn't set configFile if configFile already exists", async () => {
    mockuseConfigContext.mockReturnValueOnce({ setConfig: mockedSetConfig, config: "testConfigFile" });

    render(<WalletDecryptionContainer />);
    expect(mockedSetConfig).toBeCalledTimes(0);
  });
});
