import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccordionItemFaq } from "./AccordionItem.stories";

describe("AccordionItem", () => {
  it("should not show body content", () => {
    render(<AccordionItemFaq />);

    expect(screen.queryByText(/TradeTrust is a digital utility/)).not.toBeInTheDocument();
  });

  it("should show body content", () => {
    render(<AccordionItemFaq />);
    fireEvent.click(screen.getByText("What is TradeTrust?"));

    expect(screen.getByText(/TradeTrust is a digital utility/)).toBeInTheDocument();
  });
});
