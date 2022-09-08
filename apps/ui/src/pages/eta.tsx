import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { EtaPageContent } from "../components/EtaPageContent";

export const EtaPage: FunctionComponent = () => (
  <>
    <Helmet>
      <meta
        name="description"
        content="The Electronic Transactions Act (ETA) facilitates the use of e-commerce and e-transactions by giving e-contracts and e-signatures the same status as written contracts and signatures. Recent ETA amendments enable the creation and use of Electronic Transferable Records (ETRs), such as electrotonic Bills of Lading (eBLs)."
      />
      <meta
        property="og:description"
        content="The Electronic Transactions Act (ETA) facilitates the use of e-commerce and e-transactions by giving e-contracts and e-signatures the same status as written contracts and signatures. Recent ETA amendments enable the creation and use of Electronic Transferable Records (ETRs), such as electrotonic Bills of Lading (eBLs)."
      />
      <meta property="og:title" content="TradeTrust - Electronic Transactions Act" />
      <meta property="og:url" content={`${window.location.origin}/eta`} />
      <title>TradeTrust - Electronic Transactions Act</title>
    </Helmet>
    <EtaPageContent />
  </>
);
