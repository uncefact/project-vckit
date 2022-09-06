import { render, screen } from "@testing-library/react";
import React from "react";
import Router from "react-router-dom";
import { EventPageDetail } from "./eventDetail";

jest.mock("../../../utils", () => {
  return {
    ...jest.requireActual("../../../utils"),
    getCmsContentWithSlug: jest.fn(() => [
      {
        slug: "test",
        attributes: {
          title: "The Journey to Paperless Trade: Industry Initiatives for Interoperability",
          blurb:
            "This event by BAFT and R3 explored different blockchain-based digital trade solutions and how global trade participants can use these solutions towards challenges in the global trade ecosystem.",
          link: "https://www.baft.org/baft-education/e-learning/past-webinars",
          date: "2 Jul 2020",
          timeStart: "2021-03-19T13:00:00.000Z",
          timeEnd: "2021-03-19T14:00:00.000Z",
          videoLink: "https://www.youtube.com/watch?v=iRmaQV9HERw",
          slides: "/static/uploads/webinar-the-journey-to-paperless-trade.pdf",
          downloadableMediaContent1: "/static/uploads/webinar-the-journey-to-paperless-trade.pdf",
          eventDetails: "",
        },
      },
    ]),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

const { MemoryRouter } = Router;

describe("EventPageDetail", () => {
  it("should render the page correctly", () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ slug: "test" });

    render(
      <MemoryRouter initialEntries={["/event/test"]} initialIndex={0}>
        <EventPageDetail />
      </MemoryRouter>
    );

    expect(
      screen.getByText("The Journey to Paperless Trade: Industry Initiatives for Interoperability")
    ).not.toBeNull();
  });

  it("should render event link correctly", () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ slug: "test" });

    render(
      <MemoryRouter initialEntries={["/event/test"]} initialIndex={0}>
        <EventPageDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId("event-link").getAttribute("href")).toContain(
      "https://www.baft.org/baft-education/e-learning/past-webinars"
    );
  });

  it("should render watch link correctly", () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ slug: "test" });

    render(
      <MemoryRouter initialEntries={["/event/test"]} initialIndex={0}>
        <EventPageDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId("watch-link").getAttribute("href")).toContain("iRmaQV9HERw");
  });

  it("should render event slides correctly", () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ slug: "test" });

    render(
      <MemoryRouter initialEntries={["/event/test"]} initialIndex={0}>
        <EventPageDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId("event-slides").getAttribute("href")).toContain(
      "/static/uploads/webinar-the-journey-to-paperless-trade.pdf"
    );
  });
});
