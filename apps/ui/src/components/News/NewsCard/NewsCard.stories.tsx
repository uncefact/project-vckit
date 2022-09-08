import React from "react";
import { NewsCard } from "./NewsCard";
import { mockNewsDefault, mockNewsThumbnail } from "./NewsCard.mock";

export default {
  title: "News/NewsCard",
  component: NewsCard,
  parameters: {
    componentSubtitle: "News item in listing page",
  },
};

export const NewsSingleDefault = () => {
  return <NewsCard news={mockNewsDefault} />;
};

export const NewsSingleThumbnail = () => {
  return <NewsCard news={mockNewsThumbnail} />;
};
