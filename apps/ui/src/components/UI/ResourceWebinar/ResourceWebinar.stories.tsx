import React from "react";
import { ResourceWebinar, Webinar } from "./ResourceWebinar";

const mockResourceWebinar: Webinar = {
  youtubeEmbedCode: "NcR1M9NJ-PE",
  tag: "Non-Technical",
  downloads: [
    {
      fileName: "TradeTrust Tech Webinar 1 - Overview.pdf",
      path: "/static/images/webinar/tradetrust-tech-webinar-1-overview.pdf",
    },
    {
      fileName: "TradeTrust Tech Webinar 1 - Demo.pdf",
      path: "/static/images/webinar/tradetrust-tech-webinar-1-demo.pdf",
    },
  ],
  videoChapters: [
    {
      title: "What is TradeTrust?",
      timeStamp: 80,
    },
    {
      title: "Who can use TradeTrust?",
      timeStamp: 100,
    },
  ],
};

export default {
  title: "UI/ResourceWebinar",
  component: ResourceWebinar,
  parameters: {
    componentSubtitle: "ResourceWebinar with youtube embed.",
  },
};

export const Default = () => {
  return (
    <ResourceWebinar
      title="TradeTrust Overview"
      description="This non-technical session helps provide a foundational and critical understanding of TradeTrust as a digital utility as well as the mental framing necessary as a pre-requisite for subsequent webinars."
      resource={mockResourceWebinar}
    />
  );
};
