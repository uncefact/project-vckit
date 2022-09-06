import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { FormState } from "../../../../../constants/FormState";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { AcceptSurrenderedForm } from "./AcceptSurrenderedForm";
import { act } from "react-dom/test-utils";
import { useEndorsementChain } from "../../../../../common/hooks/useEndorsementChain";

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

describe("AcceptSurrenderedForm", () => {
  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    mockUseFeatureFlagOverride.mockReturnValue({
      endorsementChain: sampleEndorsementChain,
    });
  });
  it("should have the accept surrender button and cancel button", async () => {
    await act(async () => {
      const container = render(
        <AcceptSurrenderedForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          destroyTokenState={FormState.UNINITIALIZED}
          handleDestroyToken={() => {}}
        />
      );
      expect(container.queryByTestId("cancelSurrenderBtn")).not.toBeNull();
      expect(container.queryByTestId("acceptSurrenderBtn")).not.toBeNull();
    });
  });

  it("should change the state of the application to Confirmed when we clicked on accept surrender", async () => {
    await act(async () => {
      const mockHandleDestroyToken = jest.fn();

      const container = render(
        <AcceptSurrenderedForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          destroyTokenState={FormState.UNINITIALIZED}
          handleDestroyToken={mockHandleDestroyToken}
        />
      );

      fireEvent.click(container.getByTestId("acceptSurrenderBtn"));
      expect(mockHandleDestroyToken).toHaveBeenCalled();
    });
  });

  it("should show a loader when the accept surrender state is in PENDING_CONFIRMATION", async () => {
    await act(async () => {
      const container = render(
        <AcceptSurrenderedForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          destroyTokenState={FormState.PENDING_CONFIRMATION}
          handleDestroyToken={() => {}}
        />
      );

      expect(container.queryByTestId("accept-loader")).not.toBeNull();
    });
  });

  it("should disable accept surrender and cancel button when the accept surrender state is in PENDING_CONFIRMATION", async () => {
    await act(async () => {
      const mockHandleDestroyToken = jest.fn();
      const mockHandleRestoreToken = jest.fn();

      const container = render(
        <AcceptSurrenderedForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          destroyTokenState={FormState.PENDING_CONFIRMATION}
          handleDestroyToken={mockHandleDestroyToken}
        />
      );

      fireEvent.click(container.getByTestId("acceptSurrenderBtn"));
      expect(mockHandleDestroyToken).not.toHaveBeenCalled();
      fireEvent.click(container.getByTestId("cancelSurrenderBtn"));
      expect(mockHandleRestoreToken).not.toHaveBeenCalled();
    });
  });
});
