import { OverlayContext } from "@govtechsg/tradetrust-ui-components";

import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { useEndorsementChain } from "../../../../../common/hooks/useEndorsementChain";
import { FormState } from "../../../../../constants/FormState";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { RejectSurrenderedForm } from "./RejectSurrenderedForm";

jest.mock("../../../../../common/hooks/useEndorsementChain");

const mockUseFeatureFlagOverride = useEndorsementChain as jest.Mock;
const sampleEndorsementChain = [
  {
    eventType: "Transfer",
    documentOwner: "0x07117cCE985E750D1709191BC2a345AbA85b6993",
    beneficiary: "0x1245e5B64D785b25057f7438F715f4aA5D965733",
    holderChangeEvents: [
      { blockNumber: 8829273, holder: "0x1245e5B64D785b25057f7438F715f4aA5D965733", timestamp: 1602050689000 },
    ],
  },
];

describe("RejectSurrenderedForm", () => {
  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    mockUseFeatureFlagOverride.mockReturnValue({
      endorsementChain: sampleEndorsementChain,
    });
  });
  it("should have the cancel button and reject surrender button", async () => {
    await act(async () => {
      const container = render(
        <RejectSurrenderedForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          restoreTokenState={FormState.UNINITIALIZED}
          handleRestoreToken={() => {}}
          tokenId="0x33430b8a069f6f9115fe9403889162d6c779cccde4db8df04faaf09d6dc739ba"
        />
      );
      expect(container.queryByTestId("rejectSurrenderBtn")).not.toBeNull();
      expect(container.queryByTestId("cancelSurrenderBtn")).not.toBeNull();
    });
  });

  it("should show overlay confirmation when we clicked on reject surrender and confirm overlay", async () => {
    await act(async () => {
      const mockHandleRestoreToken = jest.fn();

      const container = render(
        <OverlayContext.Provider
          value={{
            overlayContent: undefined,
            showOverlay: mockHandleRestoreToken,
            isOverlayVisible: false,
            setOverlayVisible: () => {},
            closeOverlay: () => {},
          }}
        >
          <RejectSurrenderedForm
            setShowEndorsementChain={() => {}}
            formAction={AssetManagementActions.Surrender}
            setFormActionNone={() => {}}
            tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
            beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
            holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
            restoreTokenState={FormState.UNINITIALIZED}
            handleRestoreToken={() => {}}
            tokenId="0x33430b8a069f6f9115fe9403889162d6c779cccde4db8df04faaf09d6dc739ba"
          />
        </OverlayContext.Provider>
      );

      fireEvent.click(container.getByTestId("rejectSurrenderBtn"));
      expect(mockHandleRestoreToken).toHaveBeenCalled();
    });
  });

  it("should show a loader when the reject surrender state is in PENDING_CONFIRMATION", async () => {
    await act(async () => {
      const container = render(
        <RejectSurrenderedForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          restoreTokenState={FormState.PENDING_CONFIRMATION}
          handleRestoreToken={() => {}}
          tokenId="0x33430b8a069f6f9115fe9403889162d6c779cccde4db8df04faaf09d6dc739ba"
        />
      );

      expect(container.queryByTestId("reject-loader")).not.toBeNull();
    });
  });

  it("should disable cancel and reject surrender button when the reject surrender state is in PENDING_CONFIRMATION", async () => {
    await act(async () => {
      const mockFormActionNone = jest.fn();
      const mockHandleRestoreToken = jest.fn();

      const container = render(
        <RejectSurrenderedForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={mockFormActionNone}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          restoreTokenState={FormState.PENDING_CONFIRMATION}
          handleRestoreToken={mockHandleRestoreToken}
          tokenId="0x33430b8a069f6f9115fe9403889162d6c779cccde4db8df04faaf09d6dc739ba"
        />
      );

      fireEvent.click(container.getByTestId("cancelSurrenderBtn"));
      expect(mockFormActionNone).not.toHaveBeenCalled();
      fireEvent.click(container.getByTestId("rejectSurrenderBtn"));
      expect(mockHandleRestoreToken).not.toHaveBeenCalled();
    });
  });
});
