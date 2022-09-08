import React, { FunctionComponent, ReactElement } from "react";
import { useFeatureFlagOverride } from "../common/hooks/useFeatureFlagOverride";
import Features from "../config/feature-toggle.json";
import { IS_DEVELOPMENT } from "../config";

interface FeatureFlag {
  name: string;
  fallback?: React.ReactElement;
}

type Environment = "development" | "production";

interface EnvironmentToggle {
  development: boolean;
  production: boolean;
}

interface FeatureJson {
  [key: string]: EnvironmentToggle;
}

export const FeatureFlag: FunctionComponent<FeatureFlag> = ({ name, children, fallback }) => {
  const { getFeatureFlagOverride } = useFeatureFlagOverride();
  const override = getFeatureFlagOverride(name);
  const environment: Environment = IS_DEVELOPMENT ? "development" : "production";
  const features = Features as FeatureJson;
  const featureFlag: boolean = features?.[name]?.[environment];

  // display the feature if the flag has been overridden
  // OR
  // if the flag HAS NOT been set to FALSE (override === undefined) and the flag is enabled
  if ((override || (featureFlag && override === undefined)) && children) {
    // Casting because of incompatibility of ReactNode with FunctionComponent
    // See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return children as ReactElement;
  }
  if (!featureFlag && fallback) {
    return fallback;
  }
  return null;
};

/**
 * the hook variant of the above component FeatureFlag
 * @param name Name of the flag
 * @returns a boolean that states if the flag has been overriden (from LocalStorage), or if the flag from local config (feature-toggle.json) has not been set to false (which implies that override is undefined).
 */
export const useFeatureFlag = (name: string): boolean => {
  const { getFeatureFlagOverride } = useFeatureFlagOverride();
  const override = getFeatureFlagOverride(name);
  const environment: Environment = IS_DEVELOPMENT ? "development" : "production";
  const features = Features as FeatureJson;
  const featureFlag: boolean = features?.[name]?.[environment];

  return override || (featureFlag && override === undefined);
};
