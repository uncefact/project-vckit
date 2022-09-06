import { render, screen } from "@testing-library/react";
import React from "react";
import { FeatureFlag, useFeatureFlag } from "./FeatureFlag";
import { useFeatureFlagOverride } from "../common/hooks/useFeatureFlagOverride";

jest.mock("../config/feature-toggle.json", () => ({
  MANAGE_ASSET: {
    development: true,
  },
  JOB_POST: {
    development: false,
  },
}));

const mockUseFeatureFlagOverride = useFeatureFlagOverride as jest.Mock;
const mockGetFeature = jest.fn();

jest.mock("../common/hooks/useFeatureFlagOverride");

describe("featureFlag", () => {
  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    mockUseFeatureFlagOverride.mockReturnValue({ getFeatureFlagOverride: mockGetFeature });
    mockGetFeature.mockReturnValue(undefined);
  });

  describe("without overridden feature flag", () => {
    it("should follow default behavior when override is not present (JOB_POST)", () => {
      render(
        <FeatureFlag name="JOB_POST">
          <div>Job post</div>
        </FeatureFlag>
      );
      expect(screen.queryByText("Job post")).toBeNull();
    });

    it("should follow default behavior when override is not present (MANAGE_ASSET)", () => {
      render(
        <FeatureFlag name="MANAGE_ASSET">
          <div>Manage asset</div>
        </FeatureFlag>
      );

      expect(screen.getByText("Manage asset")).not.toBeNull();
    });

    it("should render component when MANAGE_ASSET feature flag is set to true", () => {
      const fallback = <div>This feature is not available</div>;
      render(
        <FeatureFlag name="MANAGE_ASSET" fallback={fallback}>
          <div>Share link is active</div>
        </FeatureFlag>
      );

      expect(screen.getByText("Share link is active")).not.toBeNull();
    });

    it("should render fallback component when OTHER feature flag is set to false", () => {
      const fallback = <div>This feature is not available</div>;
      render(
        <FeatureFlag name="JOB_POST" fallback={fallback}>
          <div>Other feature is active</div>
        </FeatureFlag>
      );

      expect(screen.getByText("This feature is not available")).not.toBeNull();
    });

    it("should render fallback component when EXTRA_FEATURE feature flag is not set", () => {
      const fallback = <div>This feature is not available</div>;
      render(
        <FeatureFlag name="EXTRA_FEATURE" fallback={fallback}>
          <div>Extra feature is active</div>
        </FeatureFlag>
      );

      expect(screen.getByText("This feature is not available")).not.toBeNull();
    });

    it("should not render anything when there is no render function and MANAGE_ASSET feature flag is true", () => {
      const { container } = render(<FeatureFlag name="MANAGE_ASSET" />);
      expect(container.querySelectorAll("div")).toHaveLength(0);
    });

    it("should not render anything when there is no fallback function and OTHER feature flag is false", () => {
      const { container } = render(<FeatureFlag name="JOB_POST" />);
      expect(container.querySelectorAll("div")).toHaveLength(0);
    });
  });

  describe("without overridden feature flag", () => {
    it("should render component when override is true (JOB_POST)", () => {
      mockGetFeature.mockReturnValue(true);

      render(
        <FeatureFlag name="JOB_POST">
          <div>Job post</div>
        </FeatureFlag>
      );

      expect(screen.getByText("Job post")).not.toBeNull();
    });

    it("should render component when override is true (MANAGE_ASSET)", () => {
      mockGetFeature.mockReturnValue(true);

      render(
        <FeatureFlag name="MANAGE_ASSET">
          <div>Manage asset</div>
        </FeatureFlag>
      );

      expect(screen.getByText("Manage asset")).not.toBeNull();
    });

    it("should not render component when override is false (JOB_POST)", () => {
      mockGetFeature.mockReturnValue(false);

      const { container } = render(
        <FeatureFlag name="JOB_POST">
          <div>Job post</div>
        </FeatureFlag>
      );
      expect(container.querySelectorAll("div").length).toBe(0);
    });

    it("should not render component when override is false (MANAGE_ASSET)", () => {
      mockGetFeature.mockReturnValue(false);

      const { container } = render(
        <FeatureFlag name="MANAGE_ASSET">
          <div>Manage asset</div>
        </FeatureFlag>
      );
      expect(container.querySelectorAll("div").length).toBe(0);
    });
  });
});

const RenderWithHook = ({ name, text }: { name: string; text: string }) => {
  const flag = useFeatureFlag(name);
  return render(<>{flag && <div>{text}</div>}</>);
};
describe("useFeatureFlag", () => {
  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    mockUseFeatureFlagOverride.mockReturnValue({ getFeatureFlagOverride: mockGetFeature });
    mockGetFeature.mockReturnValue(undefined);
  });

  it("should follow default behavior when override is not present (JOB_POST)", () => {
    RenderWithHook({ name: "JOB_POST", text: "Job post" });
    expect(screen.queryByText("Job post")).toBeNull();
  });
  it("should follow default behavior when override is not present (MANAGE_ASSET)", () => {
    RenderWithHook({ name: "MANAGE_ASSET", text: "Manage asset" });
    expect(screen.getByText("Manage asset")).not.toBeNull();
  });
});
