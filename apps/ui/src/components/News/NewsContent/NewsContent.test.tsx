import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewsContent, newsPerPage } from "./NewsContent";
import { NewsTag, NewsSingle, NewsSort } from "./../types";

const mock: NewsSingle[] = [
  {
    slug: "r3-partners-with-tramés-and-imda-to-develop-new-solutions-to-bridge-r3-corda-ebl-and-tradetrust",
    type: NewsTag.PARTNER_NEWS,
    attributes: {
      title: "R3 partners with Tramés and IMDA to develop new solutions to bridge R3 Corda eBL and TradeTrust",
      thumbnail: "/static/uploads/news-02.jpg",
      date: "19 Apr 2021",
    },
    body: "",
  },
  {
    slug: "adoption-of-uncitral-model-law-heralds-a-quiet-revolution-in-digital-trade",
    type: NewsTag.ARTICLE,
    attributes: {
      title: "Adoption of UNCITRAL model law heralds a quiet revolution in digital trade",
      thumbnail: "/static/uploads/news-01.jpg",
      date: "3 Feb 2021",
    },
    body: "",
  },
  {
    slug: "singapore-leading-the-way-in-promoting-digital-trade",
    type: NewsTag.ARTICLE,
    attributes: {
      title: "Singapore leading the way in promoting digital trade",
      date: "3 Feb 2021",
    },
    body: "",
  },
  {
    slug: "electronic-transactions-act-amended-to-facilitate-electronic-transactions-providing-convenience-and-strengthening-singapore’s-trade-competitiveness-in-the-digital-economy",
    type: NewsTag.PRESS_RELEASE,
    attributes: {
      title:
        "Electronic Transactions Act Amended To Facilitate Electronic Transactions, Providing Convenience And Strengthening Singapore’s Trade Competitiveness In The Digital Economy",
      thumbnail: "/static/uploads/news-03.jpg",
      date: "1 Feb 2021",
    },
    body: "",
  },
  {
    slug: "tradetrust-newsletter-issue-4",
    type: NewsTag.NEWSLETTER,
    attributes: {
      title: "TradeTrust Newsletter Issue 4",
      date: "1 Jan 2021",
      file: "/static/uploads/tradetrust-newsletter-4.pdf",
    },
    body: "",
  },
  {
    slug: "swift-and-singapores-imda-join-forces-to-drive-global-trade-digitalisation",
    type: NewsTag.PRESS_RELEASE,
    attributes: {
      title: "SWIFT and Singapore's IMDA Join Forces to Drive Global Trade Digitalisation",
      date: "5 Oct 2020",
    },
    body: "",
  },
  {
    slug: "tradetrust-newsletter-issue-3",
    type: NewsTag.NEWSLETTER,
    attributes: {
      title: "TradeTrust Newsletter Issue 3",
      date: "1 Oct 2020",
      file: "/static/uploads/tradetrust-newsletter-3.pdf",
    },
    body: "",
  },
  {
    slug: "singapore-and-australia-sign-digital-economy-agreement",
    type: NewsTag.PRESS_RELEASE,
    attributes: {
      title: "Singapore and Australia Sign Digital Economy Agreement",
      date: "6 Aug 2020",
    },
    body: "",
  },
  {
    slug: "tradetrust-newsletter-issue-2",
    type: NewsTag.NEWSLETTER,
    attributes: {
      title: "TradeTrust Newsletter Issue 2",
      date: "1 Jul 2020",
      file: "/static/uploads/tradetrust-newsletter-2.pdf",
    },
    body: "",
  },
  {
    slug: "singapore-strengthens-digital-collaboration-and-linkages-with-shenzhen-to-create-new-market-opportunities",
    type: NewsTag.PRESS_RELEASE,
    attributes: {
      title:
        "Singapore Strengthens Digital Collaboration and Linkages with Shenzhen to Create New Market Opportunities",
      date: "18 Jun 2020",
    },
    body: "",
  },
  {
    slug: "singapore-chile-and-new-zealand-sign-digital-economy-partnership-agreement-electronically",
    type: NewsTag.PRESS_RELEASE,
    attributes: {
      title: "Singapore, Chile and New Zealand Sign Digital Economy Partnership Agreement Electronically",
      date: "12 Jun 2020",
    },
    body: "",
  },
  {
    slug: "tradetrust-newsletter-issue-1",
    type: NewsTag.NEWSLETTER,
    attributes: {
      title: "TradeTrust Newsletter Issue 1",
      date: "1 Apr 2020",
      file: "/static/uploads/tradetrust-newsletter-1.pdf",
    },
    body: "",
  },
  {
    slug: "worlds-largest-business-organisation-joins-singapore-government-and-major-industry-partners-to-drive-global-digitalisation",
    type: NewsTag.PRESS_RELEASE,
    attributes: {
      title:
        "World's Largest Business Organisation Joins Singapore Government and Major Industry Partners to Drive Global Digitalisation",
      date: "22 Jan 2020",
    },
    body: "",
  },
  {
    slug: "remarks-by-mr-s-iswaran-minister-for-communications-and-information-at-the-international-chamber-of-commerce-taking-trade-digital-forum-in-davos-on-22-jan-2020",
    type: NewsTag.SPEECH,
    attributes: {
      title:
        "Remarks by Mr S Iswaran, Minister for Communications and Information, at the International Chamber of Commerce 'Taking Trade Digital' Forum in Davos on 22 Jan 2020",
      date: "22 Jan 2020",
    },
    body: "",
  },
  {
    slug: "launch-of-tradetrust-announced-by-mr-s-iswaran-minister-for-communications-and-information-at-the-committee-of-supply-debate-on-4-march-2019",
    type: NewsTag.SPEECH,
    attributes: {
      title:
        "Launch of TradeTrust announced by Mr S Iswaran, Minister for Communications and Information at the Committee of Supply Debate on 4 March 2019",
      date: "4 Mar 2019",
    },
    body: "",
  },
];

describe("NewsContent", () => {
  it("should not filter anything by default", () => {
    render(<NewsContent allNews={mock} />);
    expect(screen.getAllByTestId("news-item-link").length).toBe(newsPerPage);
  });

  it("should filter to 1 item when searched r3", () => {
    render(<NewsContent allNews={mock} />);

    fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "r3" } });
    expect(screen.getAllByTestId("news-item-link").length).toBe(1);
  });

  it("should filter by tag", () => {
    render(<NewsContent allNews={mock} />);
    fireEvent.click(screen.getByTestId("dropdown-button-filter"));
    fireEvent.click(screen.getByTestId("SPEECH"));
    expect(screen.getAllByTestId("news-item-link").length).toBe(2);
  });

  it("should show all when filter tag is cleared", () => {
    render(<NewsContent allNews={mock} />);
    fireEvent.click(screen.getByTestId("dropdown-button-filter"));
    fireEvent.click(screen.getByTestId("SPEECH"));

    fireEvent.click(screen.getByTestId("dropdown-button-filter"));
    fireEvent.click(screen.getByTestId("show-all"));
    expect(screen.getAllByTestId("news-item-link").length).toBe(newsPerPage);
  });

  it("should sort by asc date, first item to be oldest", () => {
    render(<NewsContent allNews={mock} />);

    fireEvent.click(screen.getByTestId("dropdown-button-sort"));
    fireEvent.click(screen.getByTestId(NewsSort.ASC));
    expect(screen.getAllByTestId("news-item-link")[0].innerHTML).toContain("4 Mar 2019");
  });

  it("should sort by desc date, first item to be latest", () => {
    render(<NewsContent allNews={mock} />);

    fireEvent.click(screen.getByTestId("dropdown-button-sort"));
    fireEvent.click(screen.getByTestId(NewsSort.ASC));

    fireEvent.click(screen.getByTestId("dropdown-button-sort"));
    fireEvent.click(screen.getByTestId(NewsSort.DESC));
    expect(screen.getAllByTestId("news-item-link")[0].innerHTML).toContain("19 Apr 2021");
  });
});
