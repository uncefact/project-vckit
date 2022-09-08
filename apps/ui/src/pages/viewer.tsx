import React from "react";
import { Helmet } from "react-helmet";
import { ViewerPageContainer } from "../components/ViewerPageContainer";
import { APP_NAME } from "../appConfig";

interface ViewerPageInterface {
  isMagicDemo?: boolean;
}
export const ViewerPage = (props: ViewerPageInterface): React.ReactElement => {
  return (
    <>
      <Helmet>
        <meta
          property="description"
          content={`${APP_NAME} lets you verify the documents you have of anyone from any issuer. All in one place.`}
        />
        <meta
          property="og:description"
          content={`${APP_NAME} lets you verify the documents you have of anyone from any issuer. All in one place.`}
        />
        <meta property="og:title" content={`${APP_NAME} - An easy way to check and verify your documents`} />
        <meta property="og:url" content={`${window.location.origin}/viewer`} />
        <title>{APP_NAME} - Viewer</title>
      </Helmet>
      <ViewerPageContainer {...props} />
    </>
  );
};
