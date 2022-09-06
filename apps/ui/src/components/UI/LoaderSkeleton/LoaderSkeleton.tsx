import React from "react";

interface LoaderProps {
  className?: string;
  width?: string;
}

export const LoaderSkeleton: React.FunctionComponent<LoaderProps> = ({ className, ...props }: LoaderProps) => {
  return <div className={`skeleton-loading skeleton ${className}`} {...props} />;
};
