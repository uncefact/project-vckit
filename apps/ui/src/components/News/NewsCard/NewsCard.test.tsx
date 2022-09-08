import React from "react";
import { render, screen } from "@testing-library/react";
import { NewsCard } from "./NewsCard";
import { mockNewsDefault, mockNewsThumbnail } from "./NewsCard.mock";

describe("NewsCard", () => {
  it("should render title", () => {
    render(<NewsCard news={mockNewsDefault} />);
    expect(screen.getByText("foobar")).not.toBeNull();
  });

  it("should render date", () => {
    render(<NewsCard news={mockNewsDefault} />);
    expect(screen.getByText("3 Feb 2021")).not.toBeNull();
  });

  it("should render generic thumbnail when there is no thumbnail", () => {
    render(<NewsCard news={mockNewsDefault} />);
    expect(screen.getByTestId("news-item-thumbnail").getAttribute("style")).toBe(
      "background-image: url(/static/images/news/news-generic.png);"
    );
  });

  it("should render thumbnail when there is thumbnail", () => {
    render(<NewsCard news={mockNewsThumbnail} />);
    expect(screen.getByTestId("news-item-thumbnail").getAttribute("style")).toBe(
      "background-image: url(/static/uploads/news-01.jpg);"
    );
  });
});
