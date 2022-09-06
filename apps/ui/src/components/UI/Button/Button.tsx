import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, ButtonHTMLAttributes } from "react";

interface GetSharedStylesButton {
  padding?: string;
  variant?: string;
}

const getSharedStylesButton = (shared: GetSharedStylesButton): string => {
  const { padding, variant } = shared;

  return `relative transition-colors duration-200 ease-out cursor-pointer font-bold border  ${padding} ${variant}`;
};

export enum ButtonSize {
  SM = "py-1 px-2 rounded",
  MD = "py-2 px-3 rounded",
  LG = "py-3 px-5 rounded",
}

export enum ButtonVariant {
  PRIMARY = "bg-primary text-white hover:bg-primary-dark",
  OUTLINE_PRIMARY = "bg-white text-primary hover:bg-gray-100 hover:text-primary border-primary",
  ERROR = "text-white bg-red-500 border-red-500 hover:bg-red-300 hover:border-red-300",
  DISABLED = "cursor-not-allowed bg-gray-200 text-white hover:bg-gray-200",
}

export interface ButtonDVP extends ButtonHTMLAttributes<HTMLButtonElement> {
  name?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  loading?: boolean;
}

export const Button: FunctionComponent<ButtonDVP> = ({
  name,
  className,
  children,
  disabled,
  size = ButtonSize.MD,
  variant = ButtonVariant.PRIMARY,
  type = "submit",
  loading = false,
  ...props
}) => {
  const shared = getSharedStylesButton({
    padding: size,
    variant: disabled ? ButtonVariant.DISABLED : variant,
  });

  return (
    <button
      data-testid={`button:${name || "default"} `}
      className={`${shared} ${className} `}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      <span className={`${loading ? "invisible" : ""}`}>{children}</span>
      {loading && (
        <span
          data-testid="button-spinner"
          className="absolute inline-block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <LoaderSpinner width="15px" />
        </span>
      )}
    </button>
  );
};
