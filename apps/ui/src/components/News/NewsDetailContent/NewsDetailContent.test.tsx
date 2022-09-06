import React from "react";
import { render, screen } from "@testing-library/react";
import { NewsDetailContent } from "./NewsDetailContent";
import { NewsTag, NewsSingle } from "./../types";

const mock: NewsSingle = {
  slug: "electronic-transactions-act-amended-to-facilitate-electronic-transactions-providing-convenience-and-strengthening-singapore’s-trade-competitiveness-in-the-digital-economy",
  type: NewsTag.PRESS_RELEASE,
  attributes: {
    title:
      "Electronic Transactions Act Amended To Facilitate Electronic Transactions, Providing Convenience And Strengthening Singapore’s Trade Competitiveness In The Digital Economy",
    thumbnail: "/static/uploads/news-03.jpg",
    date: "1 Feb 2021",
  },
  body: "",
};

describe("NewsDetailContent", () => {
  it("should have press release label", () => {
    render(<NewsDetailContent detail={mock} />);
    expect(screen.getByText("Press Release")).toBeInTheDocument();
  });

  it("should have title", () => {
    render(<NewsDetailContent detail={mock} />);
    expect(
      screen.getByText(
        "Electronic Transactions Act Amended To Facilitate Electronic Transactions, Providing Convenience And Strengthening Singapore’s Trade Competitiveness In The Digital Economy"
      )
    ).toBeInTheDocument();
  });

  it("should format into pretty date correctly", () => {
    render(<NewsDetailContent detail={mock} />);
    expect(screen.getByText("1 Feb 2021")).toBeInTheDocument();
  });
});
