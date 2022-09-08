import React from "react";
import { ResourceLink } from "./ResourceLink";

export default {
  title: "UI/ResourceLink",
  component: ResourceLink,
  parameters: {
    componentSubtitle: "ResourceLink examples",
  },
};

export const WithIcon = () => {
  return (
    <ResourceLink
      title="Source code"
      resources={[
        {
          title: "View TradeTrust source code",
          url: "https://github.com/TradeTrust/tradetrust-website",
        },
      ]}
      icon="/static/images/Github_Octocat.png"
    />
  );
};

export const WithMultipleEventDates = () => {
  return (
    <ResourceLink
      title="Media Centre"
      resources={[
        {
          title:
            "Launch of TradeTrust announced by Mr S Iswaran, Minister for Communications and Information at the Committee of Supply Debate on 4 March 2019",
          url: "https://www.mci.gov.sg/pressroom/news-and-stories/pressroom/2019/3/securing-our-future-in-a-digital-age#.X5gFH3jrCCc.gmail",
          date: "4 Mar 2020",
        },
        {
          title:
            "Launch of TradeTrust announced by Mr S Iswaran, Minister for Communications and Information at the Committee of Supply Debate on 4 March 2019",

          url: "https://www.mci.gov.sg/pressroom/news-and-stories/pressroom/2019/3/securing-our-future-in-a-digital-age#.X5gFH3jrCCc.gmail",
          date: "4 Mar 2019",
        },
      ]}
    />
  );
};
