import { render, screen } from "@testing-library/react";
import React from "react";
import { ResourceDownload } from "./ResourceDownload";
import { NewsTag, NewsSingle } from "../../News/types";

const mockResources: NewsSingle[] = [
  {
    slug: "foobar",
    type: NewsTag.NEWSLETTER,
    attributes: {
      title: "TradeTrust Newsletter Issue 1",
      date: "3 Feb 2021",
      file: "/static/images/newsletter/tradetrust-newsletter-issue-1.pdf",
    },
    body: "",
  },
];

describe("ResourceDownload", () => {
  it("should render download link correctly", () => {
    render(<ResourceDownload title={`Foobar`} resources={mockResources} />);

    expect(screen.getByText("TradeTrust Newsletter Issue 1").getAttribute("href")).toContain(
      "tradetrust-newsletter-issue-1.pdf"
    );
  });
});
