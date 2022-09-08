import { render, act } from "@testing-library/react";
import React from "react";
import { EditableAssetTitle } from "./EditableAssetTitle";

it("should display both the role and the value when not in editable format", async () => {
  await act(async () => {
    const container = render(
      <EditableAssetTitle role="Owner" value="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C" isEditable={false} />
    );

    const beneficiaryLabel = container.getByText("Owner:");
    const beneficiaryText = container.getByText("0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C");

    expect(beneficiaryLabel).not.toBeNull();
    expect(beneficiaryText).not.toBeNull();
  });
});

it("should display both the role and the editable field when in editable format", async () => {
  const container = render(
    <EditableAssetTitle
      role="Owner"
      value="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
      isEditable={true}
      newValue="0xE"
      onSetNewValue={() => {}}
    />
  );

  const beneficiaryLabel = container.getByText("Owner:");
  const newValue = container.getByDisplayValue("0xE");
  const inputField = container.getByTestId("editable-input-owner");

  expect(inputField).not.toBeNull();
  expect(newValue).not.toBeNull();
  expect(beneficiaryLabel).not.toBeNull();
});

it("should display placeholder when no value given", async () => {
  const container = render(
    <EditableAssetTitle
      role="Beneficiary"
      value={undefined}
      isEditable={false}
      newValue="0xE"
      onSetNewValue={() => {}}
    />
  );

  const loadingContainer = container.getByTestId("loading-skeleton-placeholder");

  expect(loadingContainer).not.toBeNull();
});
