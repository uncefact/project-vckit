import { EventProps } from "../../components/UI/ResourceEvent";
import { filterByCategory } from "./event";
import { isFuture, isPast } from "date-fns";

jest.mock("./event", () => ({
  filterByCategory: jest.fn(),
}));

const mockFilterByCategory = filterByCategory as jest.Mock;

const mockAllEvents: EventProps[] = [
  {
    slug: "",
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
  },
  {
    slug: "",
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
  },
  {
    slug: "",
    attributes: {
      title: "The Journey to Paperless Trade: Industry Initiatives for Interoperability",
      blurb:
        "This event by BAFT and R3 explored different blockchain-based digital trade solutions and how global trade participants can use these solutions towards challenges in the global trade ecosystem.",
      link: "https://www.baft.org/baft-education/e-learning/past-webinars",
      date: "31 Dec 9999",
      timeStart: "2021-03-19T13:00:00.000Z",
      timeEnd: "2021-03-19T14:00:00.000Z",
      videoLink: "https://www.youtube.com/watch?v=iRmaQV9HERw",
      slides: "/static/uploads/webinar-the-journey-to-paperless-trade.pdf",
      downloadableMediaContent: ["/static/uploads/webinar-the-journey-to-paperless-trade.pdf"],
      eventDetails: "",
    },
  },
];

describe("Event", () => {
  beforeEach(() => {
    mockFilterByCategory.mockRestore();
  });

  it("should filter event in 'All' category correctly", () => {
    mockFilterByCategory.mockReturnValueOnce(mockAllEvents);

    const filteredEvents = filterByCategory("All", mockAllEvents);
    expect(filteredEvents.length).toEqual(3);
  });

  it("should filter event in 'Upcoming Event' category correctly", () => {
    mockFilterByCategory.mockReturnValueOnce(
      mockAllEvents.filter((event) => isFuture(new Date(event.attributes.date)))
    );
    const filteredEvents = filterByCategory("Upcoming Event", mockAllEvents);
    expect(filteredEvents.length).toEqual(1);
  });

  it("should filter event in 'Past Event' category correctly", () => {
    mockFilterByCategory.mockReturnValueOnce(mockAllEvents.filter((event) => isPast(new Date(event.attributes.date))));
    const filteredEvents = filterByCategory("Past Event", mockAllEvents);
    expect(filteredEvents.length).toEqual(2);
  });
});
