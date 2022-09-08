import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { ContactUs } from "./contact";
import { EmailContactUsError } from "../components/EmailContactUs";
import { Page } from "../components/Layout/Page";

export const EmailErrorPage: FunctionComponent = () => (
  <>
    <Helmet>
      <meta property="description" content="Oops, something is not right here, please try again." />
      <meta property="og:description" content="Oops, something is not right here, please try again." />
      <meta property="og:title" content="TradeTrust - Email error" />
      <meta property="og:url" content={`${window.location.origin}/email/error`} />
      <title>TradeTrust - An easy way to check and verify your documents</title>
    </Helmet>
    <Page title="Contact Us">
      <ContactUs>
        <EmailContactUsError />
      </ContactUs>
    </Page>
  </>
);
