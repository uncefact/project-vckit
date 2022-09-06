import React from "react";

interface WrapperProps {
  className?: string;
  children: React.ReactNode;
  isMaxW?: boolean;
}

export const Wrapper: React.FunctionComponent<WrapperProps> = ({ className, children, isMaxW }: WrapperProps) => {
  return <div className={`container mt-8 ${isMaxW ? "max-w-2xl" : ""} ${className ? className : ""}`}>{children}</div>;
};
