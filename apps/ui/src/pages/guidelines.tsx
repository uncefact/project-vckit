import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { GuidelinesContent } from "../components/Guidelines";
import { Page } from "../components/Layout/Page";

export const Guidelines: FunctionComponent = () => (
  <>
    <Helmet>
      <meta name="description" content="Guidelines on Using TradeTrust with Non-Ethereum Blockchains." />
      <meta property="og:description" content="Guidelines on Using TradeTrust with Non-Ethereum Blockchains." />
      <meta property="og:title" content="TradeTrust - Guidelines" />
      <meta property="og:url" content={`${window.location.origin}/guidelines`} />
      <title>TradeTrust - Guidelines</title>
    </Helmet>
    <Page title="Using TradeTrust with non-Ethereum blockchain">
      <GuidelinesContent />
    </Page>
  </>
);
