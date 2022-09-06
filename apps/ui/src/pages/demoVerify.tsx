import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { DemoVerify } from "../components/Demo/DemoVerify";
import { Page } from "../components/Layout/Page";

export const DemoVerifyPage: FunctionComponent = () => (
  <>
    <Helmet>
      <meta
        property="description"
        content="TradeTrust lets you verify the documents you have of anyone from any issuer. All in one place."
      />
      <meta
        property="og:description"
        content="TradeTrust lets you verify the documents you have of anyone from any issuer. All in one place."
      />
      <meta property="og:title" content="TradeTrust - An easy way to check and verify your documents" />
      <meta property="og:url" content={`${window.location.origin}/demo/verify`} />
      <title>TradeTrust - Demo Verify</title>
    </Helmet>
    <Page title="Verify Demo Documents">
      <DemoVerify />
    </Page>
  </>
);
