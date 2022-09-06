import { useIdentifierResolver } from "@govtechsg/address-identity-resolver";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";
import { EndorsementChain } from "../../../types";
import { EndorsementChainLayout } from "./EndorsementChainLayout";

jest.mock("@govtechsg/address-identity-resolver", () => ({ useIdentifierResolver: jest.fn() }));

const mockUseIdentifierResolver = useIdentifierResolver as jest.Mock;

const initialEndorsementChain: EndorsementChain = [
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
];

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

/*
 * Logic in EndorsementChainLayout.tsx:
 * When the endorsementChain events above, similar to the ones from the blockchain are passed into the component,
 * the information will be extracted and restructured into an array of HistoryChain using the getHistoryChain() method.
 * Which would then be used to populate and render the different events the document has gone through.
 */

describe("EndorsementChainLayout", () => {
  it("should render the loading component when pending is true", () => {
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(<EndorsementChainLayout error={""} pending={true} setShowEndorsementChain={() => {}} />);
    expect(screen.getAllByTestId("loader-skeleton")).toHaveLength(9);
  });

  it("should render 'Endorse change of ownership' in initial endorsement chain after 'Document has been issued'", () => {
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(
      <EndorsementChainLayout
        error={""}
        pending={false}
        endorsementChain={initialEndorsementChain}
        setShowEndorsementChain={() => {}}
      />
    );
    expect(screen.getByTestId("row-event-0")).toHaveTextContent("Document has been issued");
    expect(screen.getByTestId("row-event-1")).toHaveTextContent("Endorse change of ownership");
  });

  it("should render 'Transfer holdership' and new address of new holder when there is a change in holdership from previous holder", () => {
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(
      <EndorsementChainLayout
        error={""}
        pending={false}
        endorsementChain={transferHolderEndorsementChain}
        setShowEndorsementChain={() => {}}
      />
    );
    expect(screen.getByTestId("row-event-2")).toHaveTextContent("Transfer holdership");
    expect(within(screen.getByTestId("row-event-2")).getByTestId("row-event-Holder")).toHaveTextContent(
      "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e"
    );
  });

  it("should render 'Endorse change of ownership' and new address of new beneficiary when there is a change in ownership from previous beneficiary (new title escrow created)", () => {
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(
      <EndorsementChainLayout
        error={""}
        pending={false}
        endorsementChain={endorseBeneficiaryEndorsementChain}
        setShowEndorsementChain={() => {}}
      />
    );
    expect(screen.getByTestId("row-event-2")).toHaveTextContent("Endorse change of ownership");
    expect(within(screen.getByTestId("row-event-2")).getByTestId("row-event-Owner")).toHaveTextContent(
      "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e"
    );
  });

  it("should render 'Transferred to wallet' and address of beneficiary when there is a change in ownership to the beneficiary's address", () => {
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(
      <EndorsementChainLayout
        error={""}
        pending={false}
        endorsementChain={transferToWalletEndorsementChain}
        setShowEndorsementChain={() => {}}
      />
    );
    expect(screen.getByTestId("row-event-2")).toHaveTextContent("Transferred to wallet");
    expect(within(screen.getByTestId("row-event-2")).getByTestId("row-event-Owner")).toHaveTextContent(
      "0x6FFeD6E6591b808130a9b248fEA32101b5220eca"
    );
  });

  it("should render 'Document surrendered to issuer' when document is surrendered and sent to token registry", () => {
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(
      <EndorsementChainLayout
        error={""}
        pending={false}
        endorsementChain={surrenderEndorsementChain}
        setShowEndorsementChain={() => {}}
      />
    );
    expect(screen.getByTestId("row-event-2")).toHaveTextContent("Document surrendered to issuer");
  });

  it("should render 'Surrender of document rejected' and addresses of previous beneficiary and holder when surrendered document is rejected by token registry", () => {
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(
      <EndorsementChainLayout
        error={""}
        pending={false}
        endorsementChain={rejectSurrenderedEndorsementChain}
        setShowEndorsementChain={() => {}}
      />
    );
    expect(screen.getByTestId("row-event-3")).toHaveTextContent("Surrender of document rejected");
    expect(within(screen.getByTestId("row-event-3")).getByTestId("row-event-Owner")).toHaveTextContent(
      "0x6FFeD6E6591b808130a9b248fEA32101b5220eca"
    );
    expect(within(screen.getByTestId("row-event-3")).getByTestId("row-event-Holder")).toHaveTextContent(
      "0x6FFeD6E6591b808130a9b248fEA32101b5220eca"
    );
  });

  it("should render 'Surrender of document accepted' when surrendered document is accepted and burnt by token registry", () => {
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(
      <EndorsementChainLayout
        error={""}
        pending={false}
        endorsementChain={acceptSurrenderedEndorsementChain}
        setShowEndorsementChain={() => {}}
      />
    );
    expect(screen.getByTestId("row-event-3")).toHaveTextContent("Surrender of document accepted");
  });

  it("should fire setShowEndorsementChain when back button is clicked", async () => {
    const mockSetShowEndorsementChain = jest.fn();
    mockUseIdentifierResolver.mockReturnValue({ resolvedIdentifier: "FooBar" });
    render(
      <EndorsementChainLayout
        endorsementChain={transferHolderEndorsementChain}
        setShowEndorsementChain={mockSetShowEndorsementChain}
        error={""}
        pending={false}
      />
    );
    act(() => {
      fireEvent.click(screen.getByTestId("back-button"));
    });
    expect(mockSetShowEndorsementChain).toHaveBeenCalledTimes(1);
  });
});
