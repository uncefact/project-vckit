import React from "react";

import { Button, ButtonSize, ButtonVariant } from "./Button";

export default {
  title: "UI/Button",
  component: Button,
  parameters: {
    componentSubtitle: "Button",
  },
};

export const LG = (): React.ReactNode => {
  return <Button size={ButtonSize.LG}>Large</Button>;
};

export const MD = (): React.ReactNode => {
  return <Button size={ButtonSize.MD}>Medium</Button>;
};

export const SM = (): React.ReactNode => {
  return <Button size={ButtonSize.SM}>Small</Button>;
};

export const Primary = (): React.ReactNode => {
  return <Button>Primary</Button>;
};

export const PrimaryDisabled = (): React.ReactNode => {
  return <Button disabled>PrimaryDisabled</Button>;
};

export const OutlinePrimary = (): React.ReactNode => {
  return <Button variant={ButtonVariant.OUTLINE_PRIMARY}>OutlinePrimary</Button>;
};

export const OutlinePrimaryDisabled = (): React.ReactNode => {
  return (
    <Button variant={ButtonVariant.OUTLINE_PRIMARY} disabled>
      OutlinePrimaryDisabled
    </Button>
  );
};

export const Error = (): React.ReactNode => {
  return <Button variant={ButtonVariant.ERROR}>Error</Button>;
};

export const ErrorDisabled = (): React.ReactNode => {
  return (
    <Button variant={ButtonVariant.ERROR} disabled>
      ErrorDisabled
    </Button>
  );
};
