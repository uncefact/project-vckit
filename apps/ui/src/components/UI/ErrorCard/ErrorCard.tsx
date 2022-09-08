import React, { ReactElement } from "react";

interface ErrorCardProps {
  title: string;
  description: ReactElement | string;
  button: ReactElement;
}

export const ErrorCard: React.FunctionComponent<ErrorCardProps> = ({ title, description, button }: ErrorCardProps) => {
  return (
    <div className="bg-red-100 px-8 py-6 rounded-xl">
      <div className="mb-8">
        <div className="text-rose font-bold mb-8" data-testid="error-title">
          {title}
        </div>
        <div>{description}</div>
      </div>
      {button}
    </div>
  );
};
