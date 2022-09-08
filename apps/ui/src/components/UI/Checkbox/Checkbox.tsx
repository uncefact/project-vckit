import React, { FunctionComponent, InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  children: React.ReactNode;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({ className, children, ...props }: CheckboxProps) => {
  return (
    <label className={className}>
      <div className="flex items-center">
        <div className="w-auto">
          <input type="hidden" value="No" {...props} />
          <input className="mb-0 mr-2" type="checkbox" value="Yes" {...props} />
        </div>
        <div className="flex-grow">{children}</div>
      </div>
    </label>
  );
};
