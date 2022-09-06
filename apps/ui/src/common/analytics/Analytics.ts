import { GA_MEASUREMENT_ID } from "../../../src/config";

type GaActionDefault = "page_view";
type GaAction =
  | "magic_demo_start"
  | "magic_demo_issue"
  | "magic_demo_downloaded"
  | "magic_demo_file_drop"
  | "magic_demo_drop_off";
type GaCategory = "magic_demo";

interface GaEventProps {
  action: GaAction;
  category: GaCategory;
  label?: string;
  value?: number;
}

interface GaPageViewProps {
  action: GaActionDefault;
}

export const validatePageViewEvent = (event: GaPageViewProps): void => {
  const { action } = event;
  if (!action) console.error("Action is required");
  if (action && typeof action !== "string") console.error("Action must be a string");
};

export const gaPageView = (event: GaPageViewProps): void => {
  validatePageViewEvent(event);
  const { action } = event;
  gtag("event", action, {
    send_to: GA_MEASUREMENT_ID,
  });
};

export const validateGaEvent = (event: GaEventProps): void => {
  const { action, category, label, value } = event;
  if (!category) console.error("Category is required");
  if (!action) console.error("Action is required");
  if (label && typeof label !== "string") console.error("Label must be a string");
  if (value && typeof value !== "number") console.error("Value must be a number");
};

export const gaEvent = (event: GaEventProps): void => {
  validateGaEvent(event);
  const { action, category, label, value } = event;
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
