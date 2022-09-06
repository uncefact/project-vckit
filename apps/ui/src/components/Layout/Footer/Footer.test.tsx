import React from "react";
import { fireEvent, within, render } from "@testing-library/react";
import { Footer } from "./Footer";

jest.mock("../../../appConfig", () => ({
  FOOTER_LINKS: [
    {
      text: "Footer Link 1",
      href: "/footer/1",
    },
    {
      text: "Footer Link 2",
      href: "/footer/2",
    },
  ],
}));

describe("Footer", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<Footer name="test" />);

    const footer = getByTestId("footer:test");
    expect(footer.children.length).toEqual(3); // Logo + Links + Copyright

    const footerItem1 = getByTestId("footer:item:Footer Link 1");
    within(footerItem1).getByText("Footer Link 1");
    const footerLink1 = getByTestId("footer:item:Footer Link 1:link");
    expect(footerLink1).toHaveAttribute("href", "/footer/1");

    const footerItem2 = getByTestId("footer:item:Footer Link 2");
    within(footerItem2).getByText("Footer Link 2");
    const footerLink2 = getByTestId("footer:item:Footer Link 2:link");
    expect(footerLink2).toHaveAttribute("href", "/footer/2");
  });

  it("should should navigate to correct route when link is clicked", async () => {
    const { getByTestId } = render(<Footer name="test" />);
    const link1 = getByTestId("footer:item:Footer Link 1:link");

    fireEvent.click(link1);
    expect(location.pathname).toEqual("/footer/1");
  });
});
