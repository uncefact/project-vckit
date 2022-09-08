import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { HomePageContainer } from "../components/HomePageContent";
import { APP_NAME } from "../appConfig";

export const HomePage: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={`${APP_NAME} lets you verify the documents you have of anyone from any issuer. All in one place.`}
        />
        <meta
          property="og:description"
          content={`${APP_NAME} lets you verify the documents you have of anyone from any issuer. All in one place.`}
        />
        <meta property="og:title" content={`${APP_NAME} - Home`} />
        <meta property="og:url" content={`${window.location.origin}`} />
        <title>{APP_NAME} - Home</title>
      </Helmet>
      <HomePageContainer />
    </>
  );
};
