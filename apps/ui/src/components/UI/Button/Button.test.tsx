import React from "react";
import { fireEvent, render, within } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<Button name="test">Test Button</Button>);
    const button = getByTestId("button:test");
    expect(within(button).findByText("Test Button"));
  });

  it("should call correct function on click", () => {
    const mockFunc = jest.fn();
    const { getByTestId } = render(
      <Button name="test" onClick={mockFunc}>
        Test Button
      </Button>
    );
    const button = getByTestId("button:test");
    fireEvent.click(button);
    expect(mockFunc).toHaveBeenCalled();
  });
});
