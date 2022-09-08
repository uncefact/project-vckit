import React from "react";
import { within, render } from "@testing-library/react";
import { NavigationBar } from "./NavigationBar";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuthContext } from "../../../common/contexts/AuthenticationContext/AuthContext";

jest.mock("../../../common/contexts/AuthenticationContext/AuthContext");

const mockUseAuthContext = useAuthContext as jest.Mock;
mockUseAuthContext.mockReturnValue({ isLoggedIn: false });

describe("NavigationBar", () => {
  it("should render correctly when usere is logged out", () => {
    const { getByTestId } = render(
      <Router>
        <NavigationBar toggleNavBar={false} setToggleNavBar={jest.fn()} leftItems={[]} rightItems={[]} />
      </Router>
    );

    const navBar = getByTestId("navbar");
    within(navBar).getAllByText("Verify Doc");
    within(navBar).getAllByText("Create Doc");
    within(navBar).getAllByText("Login");
  });

  it("should render correctly when user is logged in", () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true });

    const { getByTestId } = render(
      <Router>
        <NavigationBar toggleNavBar={false} setToggleNavBar={jest.fn()} leftItems={[]} rightItems={[]} />
      </Router>
    );

    const navBar = getByTestId("navbar");
    within(navBar).getAllByText("Verify Doc");
    within(navBar).getAllByText("Create Doc");
    within(navBar).getAllByText("Logout");
  });

  it("should render links with correct hrefs", async () => {
    const { getAllByTestId } = render(
      <Router>
        <NavigationBar toggleNavBar={false} setToggleNavBar={jest.fn()} leftItems={[]} rightItems={[]} />
      </Router>
    );

    const verifyButton = getAllByTestId("navbar-verify-doc")[0];
    expect(verifyButton).toHaveAttribute("href", "/verify");

    const createButton = getAllByTestId("navbar-create-doc")[0];
    expect(createButton).toHaveAttribute("href", "/creator");
  });
});
