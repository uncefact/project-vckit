import React, { FunctionComponent } from "react";
import { getSortedByDateDesc } from "../../utils";
import { NewsTag } from "./types";
import { NewsContent } from "./NewsContent/NewsContent";
import { getCmsContentWithSlug } from "../../utils";

const importedArticles = require.context("./../../../cms/article/", false, /\.md$/);
const importedNewsletters = require.context("./../../../cms/newsletter/", false, /\.md$/);
const importedPartnerNews = require.context("./../../../cms/partner-news/", false, /\.md$/);
const importedPressReleases = require.context("./../../../cms/press-release/", false, /\.md$/);
const importedSpeeches = require.context("./../../../cms/speech/", false, /\.md$/);

const articles = getCmsContentWithSlug(importedArticles, NewsTag.ARTICLE);
const newsletters = getCmsContentWithSlug(importedNewsletters, NewsTag.NEWSLETTER);
const partnerNews = getCmsContentWithSlug(importedPartnerNews, NewsTag.PARTNER_NEWS);
const pressReleases = getCmsContentWithSlug(importedPressReleases, NewsTag.PRESS_RELEASE);
const speeches = getCmsContentWithSlug(importedSpeeches, NewsTag.SPEECH);

export const allNews = getSortedByDateDesc([
  ...articles,
  ...newsletters,
  ...partnerNews,
  ...pressReleases,
  ...speeches,
]);

export const News: FunctionComponent = () => {
  return <NewsContent allNews={allNews} />; // require.context affects tests, storybook compilation, so lets keep them separately in a simple component here
};
