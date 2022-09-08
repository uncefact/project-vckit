import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CustomArrayFieldTemplate } from "./CustomArrayField";

const mockProps: any = {
  title: "foobar",
  canAdd: true,
  onAddClick: jest.fn(),
  items: [
    { onReorderClick: jest.fn(), onDropIndexClick: jest.fn(), hasMoveUp: false, hasMoveDown: true, hasRemove: true },
    { onReorderClick: jest.fn(), onDropIndexClick: jest.fn(), hasMoveUp: true, hasMoveDown: true, hasRemove: true },
    { onReorderClick: jest.fn(), onDropIndexClick: jest.fn(), hasMoveUp: true, hasMoveDown: true, hasRemove: true },
    { onReorderClick: jest.fn(), onDropIndexClick: jest.fn(), hasMoveUp: true, hasMoveDown: true, hasRemove: true },
    { onReorderClick: jest.fn(), onDropIndexClick: jest.fn(), hasMoveUp: true, hasMoveDown: false, hasRemove: true },
  ],
};

describe("CustomArrayFieldTemplate", () => {
  it("should render the title", () => {
    render(<CustomArrayFieldTemplate {...mockProps} />);
    expect(screen.getByText("foobar")).not.toBeNull();
  });

  it("should correct number of items", () => {
    render(<CustomArrayFieldTemplate {...mockProps} />);

    expect(screen.getAllByRole("listitem").length).toBe(5);
  });

  it("should render add item correctly", () => {
    render(<CustomArrayFieldTemplate {...mockProps} />);
    expect(screen.getByText("Add Item")).not.toBeNull();

    fireEvent.click(screen.getByText("Add Item"));
    expect(mockProps.onAddClick).toHaveBeenCalledTimes(1);
  });
});
