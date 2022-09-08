import { fireEvent, render, screen } from "@testing-library/react";
import { LoginButton } from "./LoginButton";
import { useAuthContext } from "../../../common/contexts/AuthenticationContext/AuthContext";

jest.mock("../../../common/contexts/AuthenticationContext/AuthContext");

const mockUseAuthContext = useAuthContext as jest.Mock;

const mockedLogin = jest.fn().mockResolvedValue("");

mockUseAuthContext.mockReturnValue({ login: mockedLogin });

window.prompt = jest.fn();

describe("loginButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have login as the button text", () => {
    render(<LoginButton />);

    expect(screen.queryByText(/Login/)).not.toBeNull();
  });

  it("should invoke login function when button is clicked", () => {
    render(<LoginButton />);
    fireEvent.click(screen.getByText("Login"));

    expect(mockedLogin).toBeCalledTimes(1);
  });

  it("should show spinner and disable button if clicked", () => {
    const { container } = render(<LoginButton />);
    fireEvent.click(screen.getByText("Login"));

    expect(screen.getByTestId("button:default")).toHaveAttribute("disabled");
    expect(container.getElementsByClassName("invisible").length).toBe(1);
    expect(screen.getByTestId("button-spinner")).not.toBeNull();
  });

  it("should prompt user for email", () => {
    render(<LoginButton />);
    fireEvent.click(screen.getByText("Login"));

    expect(window.prompt).toHaveBeenCalled();
    expect(window.prompt).toHaveBeenCalledWith("Please enter your email to login");
  });
});
