import { render, screen } from "@testing-library/react";
import React from "react";
import { ResourceEvent, EventProps } from "./ResourceEvent";
import { MemoryRouter } from "react-router-dom";

const mockEventMedia: EventProps = {
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
    downloadableMediaContent: ["/static/uploads/webinar-the-journey-to-paperless-trade.pdf"],
    eventDetails: "",
  },
};

describe("ResourceEvent", () => {
  it("should render title correctly", () => {
    render(
      <MemoryRouter>
        <ResourceEvent slug={mockEventMedia.slug} attributes={mockEventMedia.attributes} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("The Journey to Paperless Trade: Industry Initiatives for Interoperability")
    ).not.toBeNull();
  });

  it("should render the blurb correctly", () => {
    render(
      <MemoryRouter>
        <ResourceEvent slug={mockEventMedia.slug} attributes={mockEventMedia.attributes} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "This event by BAFT and R3 explored different blockchain-based digital trade solutions and how global trade participants can use these solutions towards challenges in the global trade ecosystem."
      )
    ).not.toBeNull();
  });

  it("should render date correctly", () => {
    render(
      <MemoryRouter>
        <ResourceEvent slug={mockEventMedia.slug} attributes={mockEventMedia.attributes} />
      </MemoryRouter>
    );

    expect(screen.getByText("2 Jul 2020")).not.toBeNull();
  });

  it("should render time correctly", () => {
    render(
      <MemoryRouter>
        <ResourceEvent slug={mockEventMedia.slug} attributes={mockEventMedia.attributes} />
      </MemoryRouter>
    );

    expect(screen.getByText("21:00 to 22:00 (GMT+8)")).not.toBeNull();
  });
});
