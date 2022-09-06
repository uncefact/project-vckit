import React from "react";
import { AddressInfo } from "./AddressInfo";
import { ExternalLink } from "../UI/ExternalLink";

export default {
  title: "TitleTransfer/AddressInfo",
  component: AddressInfo,
  parameters: {
    componentSubtitle: "AddressInfo with role, resolved address, external link.",
  },
};

export const AddressInfoBeneficiary = () => {
  return (
    <AddressInfo title="Owner" name="Bank of China" resolvedBy="Demo 1" source="Company, Singapore">
      <ExternalLink name="0x1D350495B4C2a51fBf1c9DEDadEAb288250C703e" href="#" />
    </AddressInfo>
  );
};

export const AddressInfoHolder = () => {
  return (
    <AddressInfo title="Holder" name="Bank of China" resolvedBy="Demo 2" source="Company, Singapore">
      <ExternalLink name="0x1D350495B4C2a51fBf1c9DEDadEAb288250C703e" href="#" />
    </AddressInfo>
  );
};

export const AddressInfoBLInfo = () => {
  return (
    <AddressInfo title="BL information" name="" resolvedBy="" source="">
      <>
        <ExternalLink name="View BL Registry" href="#" />
        <br />
        <ExternalLink name="View Endorsement Chain" href="#" />
      </>
    </AddressInfo>
  );
};
