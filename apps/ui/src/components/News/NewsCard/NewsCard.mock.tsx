import { NewsTag, NewsSingle } from "./../types";

export const mockNewsDefault: NewsSingle = {
  slug: "foobar",
  type: NewsTag.NEWSLETTER,
  attributes: {
    title: "foobar",
    date: "3 Feb 2021",
  },
  body: "",
};

export const mockNewsThumbnail: NewsSingle = {
  ...mockNewsDefault,
  attributes: {
    ...mockNewsDefault.attributes,
    thumbnail: "/static/uploads/news-01.jpg",
  },
};
