import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LogoutButton } from "./LogoutButton";
import { useAuthContext } from "../../../common/contexts/AuthenticationContext/AuthContext";
import { useConfigContext } from "../../../common/contexts/config";
import { usePersistedConfigFile } from "../../../common/hooks/usePersistedConfigFile";

jest.mock("../../../common/contexts/AuthenticationContext/AuthContext");
jest.mock("../../../common/contexts/config");
jest.mock("../../../common/hooks/usePersistedConfigFile");

const mockUseAuthContext = useAuthContext as jest.Mock;
const mockuseConfigContext = useConfigContext as jest.Mock;
const mockusePersistedConfigFile = usePersistedConfigFile as jest.Mock;

const mockedLogout = jest.fn();
mockUseAuthContext.mockReturnValue({ logout: mockedLogout });

const mockedSetConfig = jest.fn();
mockuseConfigContext.mockReturnValue({ setConfig: mockedSetConfig });

const mockedSetConfigFile = jest.fn();
mockusePersistedConfigFile.mockReturnValue({ setConfigFile: mockedSetConfigFile });

describe("logoutButton", () => {
  it("should have logout as the button text", () => {
    render(<LogoutButton />);

    expect(screen.queryByText(/Logout/)).not.toBeNull();
  });

  it("should invoke logout function and clear config files when button is clicked", async () => {
    render(<LogoutButton />);
    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => expect(mockedLogout).toHaveBeenCalledTimes(1));

    expect(mockedSetConfig).toBeCalledTimes(1);
    expect(mockedSetConfig).toBeCalledWith();

    expect(mockedSetConfigFile).toBeCalledTimes(1);
    expect(mockedSetConfigFile).toBeCalledWith();
  });

  it("should show spinner and disable button if clicked", () => {
    const { container } = render(<LogoutButton />);
    fireEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("button:default")).toHaveAttribute("disabled");
    expect(container.getElementsByClassName("invisible").length).toBe(1);
    expect(screen.getByTestId("button-spinner")).not.toBeNull();
  });
});
