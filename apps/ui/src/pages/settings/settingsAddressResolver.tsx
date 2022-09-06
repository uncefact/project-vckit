import { AddressResolver, BackArrow } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export const SettingsAddressResolverPage: FunctionComponent = () => (
  <>
    <Helmet>
      <meta property="description" content="Add third party’s endpoint to resolve addresses." />
      <meta property="og:description" content="Add third party’s endpoint to resolve addresses." />
      <meta property="og:title" content="TradeTrust - An easy way to check and verify your documents" />
      <meta property="og:url" content={`${window.location.origin}/settings/address-resolver`} />
      <title>TradeTrust - Address Resolver</title>
    </Helmet>
    <div className="container py-8">
      <Link to="/settings">
        <BackArrow />
      </Link>
      <div className="flex-1 flex-col">
        <h2 className="font-ubuntu text-4xl text-cloud-900">Resolver: Address</h2>
        <p className="mb-5 text-cloud-900">Add third party’s endpoint to resolve addresses.</p>
      </div>
      <AddressResolver />
    </div>
  </>
);
