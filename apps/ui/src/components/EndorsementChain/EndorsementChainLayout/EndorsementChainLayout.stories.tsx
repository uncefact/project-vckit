import React from "react";
import { EndorsementChain } from "../../../types";
import { EndorsementChainLayout } from "./EndorsementChainLayout";

export default {
  title: "Viewer/EndorsementChainLayout",
  component: EndorsementChainLayout,
};

const transferHolderEndorsementChain: EndorsementChain = [
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8282976,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594608110000,
      },
      {
        blockNumber: 8283034,
        holder: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
        timestamp: 1594608809000,
      },
    ],
  },
];

const endorseBeneficiaryEndorsementChain: EndorsementChain = [
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8282976,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594608110000,
      },
    ],
  },
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Transfer",
    beneficiary: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
    holderChangeEvents: [
      {
        blockNumber: 8282976,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594608809000,
      },
    ],
  },
];

const transferToWalletEndorsementChain: EndorsementChain = [
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8282976,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594608110000,
      },
    ],
  },
  {
    documentOwner: "0xBee0875Ba8069ed5c48E6A670118EF1C6B1E7fC0",
    eventType: "Transfer to Wallet",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    eventTimestamp: 1594609205000,
  },
];

const surrenderEndorsementChain: EndorsementChain = [
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8282976,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594608110000,
      },
    ],
  },
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Surrender",
    eventTimestamp: 1594609205000,
  },
];

const rejectSurrenderedEndorsementChain: EndorsementChain = [
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8282976,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594608110000,
      },
    ],
  },
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Surrender",
    eventTimestamp: 1594609205000,
  },
  {
    documentOwner: "0xd413cF518B7aE838fbd994a653Af350AF6f72379",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8283052,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594609306000,
      },
    ],
  },
];

const acceptSurrenderedEndorsementChain: EndorsementChain = [
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8282976,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594608110000,
      },
    ],
  },
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Surrender",
    eventTimestamp: 1594609205000,
  },
  {
    documentOwner: "0x000000000000000000000000000000000000dEaD",
    eventType: "Burnt",
    eventTimestamp: 1594609405000,
  },
];

const sampleSuccessEndorsementChain: EndorsementChain = [
  {
    documentOwner: "0x748938d2DEc5511A50F836ede82e2831cC4A7f80",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8282976,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594608110000,
      },
      {
        blockNumber: 8283034,
        holder: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
        timestamp: 1594608809000,
      },
    ],
  },
  {
    documentOwner: "0xe23e0E06DF75279Fb9A4471adCbeb9c240E5C4F3",
    eventType: "Transfer",
    beneficiary: "0x32507B8838562c0fc881dA6Ce00162B184a34955",
    holderChangeEvents: [
      {
        blockNumber: 8283040,
        holder: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
        timestamp: 1594608903000,
      },
    ],
  },
  {
    documentOwner: "0xe23e0E06DF75279Fb9A4471adCbeb9c240E5C4F3",
    eventType: "Transfer",
    beneficiary: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
    holderChangeEvents: [
      {
        blockNumber: 8283040,
        holder: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
        timestamp: 1594608903000,
      },
    ],
  },
  {
    documentOwner: "0xBee0875Ba8069ed5c48E6A670118EF1C6B1E7fC0",
    eventType: "Transfer to Wallet",
    beneficiary: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
    eventTimestamp: 1594609205000,
  },
  {
    documentOwner: "0xd413cF518B7aE838fbd994a653Af350AF6f72379",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8283046,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594609306000,
      },
    ],
  },
  {
    documentOwner: "0xd413cF518B7aE838fbd994a653Af350AF6f72379",
    eventType: "Surrender",
    eventTimestamp: 1594609402000,
  },
  {
    documentOwner: "0xd413cF518B7aE838fbd994a653Af350AF6f72379",
    eventType: "Transfer",
    beneficiary: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
    holderChangeEvents: [
      {
        blockNumber: 8283052,
        holder: "0x6FFeD6E6591b808130a9b248fEA32101b5220eca",
        timestamp: 1594609508000,
      },
    ],
  },
  {
    documentOwner: "0xe23e0E06DF75279Fb9A4471adCbeb9c240E5C4F3",
    eventType: "Transfer",
    beneficiary: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
    holderChangeEvents: [
      {
        blockNumber: 8283046,
        holder: "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e",
        timestamp: 1594609608000,
      },
    ],
  },
  {
    documentOwner: "0xe23e0E06DF75279Fb9A4471adCbeb9c240E5C4F3",
    eventType: "Surrender",
    eventTimestamp: 1594609708000,
  },
  {
    documentOwner: "0x000000000000000000000000000000000000dEaD",
    eventType: "Burnt",
    eventTimestamp: 1594609808000,
  },
];

export const Loading = () => {
  return <EndorsementChainLayout pending={true} setShowEndorsementChain={() => {}} />;
};

export const Error = () => {
  return <EndorsementChainLayout error="UNKNOWN" pending={false} setShowEndorsementChain={() => {}} />;
};

export const TransferHolder = () => {
  return (
    <EndorsementChainLayout
      endorsementChain={transferHolderEndorsementChain}
      pending={false}
      setShowEndorsementChain={() => {}}
    />
  );
};

export const EndorseBeneficiary = () => {
  return (
    <EndorsementChainLayout
      endorsementChain={endorseBeneficiaryEndorsementChain}
      pending={false}
      setShowEndorsementChain={() => {}}
    />
  );
};

export const TransferToWallet = () => {
  return (
    <EndorsementChainLayout
      endorsementChain={transferToWalletEndorsementChain}
      pending={false}
      setShowEndorsementChain={() => {}}
    />
  );
};

export const Surrender = () => {
  return (
    <EndorsementChainLayout
      endorsementChain={surrenderEndorsementChain}
      pending={false}
      setShowEndorsementChain={() => {}}
    />
  );
};

export const RejectSurrendered = () => {
  return (
    <EndorsementChainLayout
      endorsementChain={rejectSurrenderedEndorsementChain}
      pending={false}
      setShowEndorsementChain={() => {}}
    />
  );
};

export const AcceptSurrendered = () => {
  return (
    <EndorsementChainLayout
      endorsementChain={acceptSurrenderedEndorsementChain}
      pending={false}
      setShowEndorsementChain={() => {}}
    />
  );
};

export const SampleSuccessFlow = () => {
  return (
    <EndorsementChainLayout
      endorsementChain={sampleSuccessEndorsementChain}
      pending={false}
      setShowEndorsementChain={() => {}}
    />
  );
};
