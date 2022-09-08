import React from "react";

interface CardProps {
  title?: React.ReactElement;
  children: React.ReactNode;
}

export const Card: React.FunctionComponent<CardProps> = ({ title, children }: CardProps) => {
  return (
    <div className="max-w-3xl">
      {title && <div className="mb-4">{title}</div>}
      <div className="rounded-lg shadow-md bg-white p-6">{children}</div>
    </div>
  );
};
