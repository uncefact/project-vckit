import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { News } from "../components/News";
import { Page } from "../components/Layout/Page";

export const NewsPage: FunctionComponent = () => (
  <>
    <Helmet>
      <meta
        property="description"
        content="Check out our events and browse through our latest news and official statements."
      />
      <meta
        property="og:description"
        content="Check out our events and browse through our latest news and official statements."
      />
      <meta property="og:title" content="TradeTrust - An easy way to check and verify your documents" />
      <meta property="og:url" content={`${window.location.origin}/news`} />
      <title>TradeTrust - News</title>
    </Helmet>
    <Page title="News">
      <p className="mt-2 mb-12">Check out our events and browse through our latest news and official statements.</p>
      <News />
    </Page>
  </>
);
