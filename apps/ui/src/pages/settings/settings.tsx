import { TileInfo, TileInfoProps, IconAddressBook, IconResolverAddress } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Page } from "../../components/Layout/Page";

interface SettingsOptions extends TileInfoProps {
  pathLink: string;
}

const settingsOptions: SettingsOptions[] = [
  {
    title: "Address Book",
    description: "Access and update your addresses",
    tileIcon: <IconAddressBook className="max-w-full" />,
    pathLink: "/settings/address-book",
  },
  {
    title: "Address Book Resolver",
    description: "Set up and add third party’s endpoint to resolve addresses’ identity",
    tileIcon: <IconResolverAddress className="max-w-full" />,
    pathLink: "/settings/address-resolver",
  },
];

export const SettingsPage: FunctionComponent = () => (
  <>
    <Helmet>
      <meta property="description" content="TradeTrust settings page." />
      <meta property="og:description" content="TradeTrust settings page." />
      <meta property="og:title" content="TradeTrust - An easy way to check and verify your documents" />
      <meta property="og:url" content={`${window.location.origin}/settings`} />
      <title>TradeTrust - Settings</title>
    </Helmet>
    <Page title="Settings">
      <div className="flex flex-col flex-wrap mt-4 md:flex-row">
        {settingsOptions.map((details, index) => (
          <div className="mr-4 mb-4" key={index}>
            <Link to={details.pathLink} className="inline-block">
              <TileInfo title={details.title} description={details.description} tileIcon={details.tileIcon} />
            </Link>
          </div>
        ))}
      </div>
    </Page>
  </>
);
