import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import SvgTemplate from "../svgTemplate";
import { purchaseOrderSample, PurchaseOrderSample } from "../../samples/purchaseOrderSample";

describe("SvgTemplate", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("renders SVG with svg content", async () => {
    render(<SvgTemplate document={purchaseOrderSample} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const svgElement = await screen.findByTestId("svg-renderer-element");
    expect(svgElement).toBeTruthy();
    expect(screen.findByText("fe71665a-e7b3-49ba-ac89-82fc2bf1e877")).resolves.toBeTruthy();
  });

  test("renders when document.svg is empty", async () => {
    render(<SvgTemplate document={{ ...purchaseOrderSample, svg: "" }} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const svgElement = await screen.findByTestId("svg-renderer-element");
    expect(svgElement).toBeTruthy();
    expect(svgElement.textContent).toBe("");
  });

  test("renders when document.svg is a random text", async () => {
    const document = { ...purchaseOrderSample, svg: "random text" };
    render(<SvgTemplate document={document} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const svgElement = await screen.findByTestId("svg-renderer-element");
    expect(svgElement).toBeTruthy();
    expect(svgElement.textContent).toBe("random text");
  });
});
