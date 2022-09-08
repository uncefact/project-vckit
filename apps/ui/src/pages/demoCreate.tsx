import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { DemoCreate } from "../components/Demo/DemoCreate";
import { DemoCreateProvider } from "../components/Demo/DemoCreate/contexts/DemoCreateContext";
import { DemoFormProvider } from "../components/Demo/DemoCreate/contexts/DemoFormContext";
import { Page } from "../components/Layout/Page";
import { DemoLayout } from "./demo";

export const DemoCreatePage: FunctionComponent = () => (
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
      <meta property="og:url" content={`${window.location.origin}/demo-create`} />
      <title>TradeTrust - Demo</title>
    </Helmet>
    <Page title="Demo">
      <DemoLayout>
        <DemoFormProvider>
          <DemoCreateProvider>
            <DemoCreate />
          </DemoCreateProvider>
        </DemoFormProvider>
      </DemoLayout>
    </Page>
  </>
);
