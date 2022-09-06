import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { DemoInitial } from "../components/Demo/DemoInitial";
import { Page } from "../components/Layout/Page";
import { resetDemoCreateState } from "../reducers/demo-create";
import { resetDemoState as resetDemoVerifyState } from "../reducers/demo-verify";
import { useDispatch } from "react-redux";

export const DemoLayout: FunctionComponent = ({ children }) => {
  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full lg:w-2/3 xl:w-1/2">
        <div className="bg-white rounded-xl shadow-xl p-6">{children}</div>
      </div>
      <div className="w-1/2 lg:w-1/3 xl:w-1/2 mx-auto my-8">
        <img className="max-h-96 mx-auto" src="/static/images/faq/faq-man.png" alt="FAQ person" />
      </div>
    </div>
  );
};

export const Demo: FunctionComponent = () => {
  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    dispatch(resetDemoCreateState());
    dispatch(resetDemoVerifyState());
  }, [dispatch]);

  return <DemoInitial />;
};

export const DemoPage: FunctionComponent = () => (
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
      <meta property="og:url" content={`${window.location.origin}/demo`} />
      <title>TradeTrust - Demo</title>
    </Helmet>
    <Page title="Demo">
      <DemoLayout>
        <Demo />
      </DemoLayout>
    </Page>
  </>
);
