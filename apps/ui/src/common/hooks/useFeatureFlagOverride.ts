import createPersistedState from "use-persisted-state";
import { useEffect, Dispatch, SetStateAction } from "react";

export interface FeatureFlagOverride {
  [key: string]: boolean | undefined;
  ALL?: boolean;
}

const originalSetItem = localStorage.setItem;

const EVENT_NAME = "LocalStorageInserted";
// use custom event because storage event doesn't work for the current window
// https://stackoverflow.com/questions/26974084/listen-for-changes-with-localstorage-on-the-same-window
// the event must be triggered AFTER updating the storage
localStorage.setItem = function (...args) {
  const event = new Event(EVENT_NAME);
  originalSetItem.apply(this, args);
  document.dispatchEvent(event);
};

export const useFeatureFlagOverride = (): {
  featureFlagOverride: FeatureFlagOverride;
  setFeatureFlagOverride: Dispatch<SetStateAction<FeatureFlagOverride>>;
  getFeatureFlagOverride: (flag: string) => boolean | undefined;
} => {
  const defaultOverride: FeatureFlagOverride = {};
  const [featureFlagOverride, setFeatureFlagOverride] = createPersistedState("FEATURE_FLAG")(defaultOverride);
  const getFeatureFlagOverride = (flag: string) =>
    typeof featureFlagOverride.ALL === "boolean" ? featureFlagOverride.ALL : featureFlagOverride[flag];

  // listen to the local storages changes, and update the flag accordingly
  useEffect(() => {
    const localStorageInsertedHandler = () => {
      const localStorageObject = JSON.parse(window.localStorage.getItem("FEATURE_FLAG") ?? "{}");
      const changed = Object.keys(localStorageObject).find((key) => {
        return localStorageObject[key] !== featureFlagOverride[key];
      });
      // only update IF there is at least one change in the object updated
      if (changed) {
        setFeatureFlagOverride(localStorageObject);
      }
    };

    document.addEventListener(EVENT_NAME, localStorageInsertedHandler, false);
    return () => {
      document.removeEventListener(EVENT_NAME, localStorageInsertedHandler, false);
    };
  }, [featureFlagOverride, setFeatureFlagOverride]);
  return { featureFlagOverride, setFeatureFlagOverride, getFeatureFlagOverride };
};
