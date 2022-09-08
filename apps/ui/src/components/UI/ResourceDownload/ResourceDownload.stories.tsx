import React from "react";
import { ResourceDownload } from "./ResourceDownload";
import { NewsTag } from "../../News/types";

export default {
  title: "UI/ResourceDownload",
  component: ResourceDownload,
  parameters: {
    componentSubtitle: "ResourceDownload with pdf",
  },
};

export const Default = () => {
  return (
    <ResourceDownload
      title="Newsletters"
      resources={[
        {
          slug: "foo bar",
          type: NewsTag.NEWSLETTER,
          attributes: {
            title: "TradeTrust Newsletter Issue 1",
            date: "3 Feb 2021",
            file: "/static/images/newsletter/tradetrust-newsletter-1.pdf",
          },
          body: "",
        },
        {
          slug: "foo bar",
          type: NewsTag.NEWSLETTER,
          attributes: {
            title: "TradeTrust Newsletter Issue 2",
            date: "3 Feb 2021",
            file: "/static/images/newsletter/tradetrust-newsletter-2.pdf",
          },
          body: "",
        },
        {
          slug: "foo bar",
          type: NewsTag.NEWSLETTER,
          attributes: {
            title: "TradeTrust Newsletter Issue 3",
            date: "3 Feb 2021",
            file: "/static/images/newsletter/tradetrust-newsletter-3.pdf",
          },
          body: "",
        },
      ]}
    />
  );
};
