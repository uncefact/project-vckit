// let's separate types in here, to avoid require.context

export enum NewsTag {
  ARTICLE = "Article",
  NEWSLETTER = "Newsletter",
  PARTNER_NEWS = "Partner News",
  PRESS_RELEASE = "Press Release",
  SPEECH = "Speech",
}

export enum NewsSort {
  ASC = "Ascending Date",
  DESC = "Descending Date",
}

export type NewsType =
  | NewsTag.ARTICLE
  | NewsTag.NEWSLETTER
  | NewsTag.PARTNER_NEWS
  | NewsTag.PRESS_RELEASE
  | NewsTag.SPEECH;

export type NewsSingle = {
  slug: string;
  type: NewsType;
  attributes: {
    title: string;
    date: string;
    thumbnail?: string;
    file?: string;
  };
  body: string;
};
