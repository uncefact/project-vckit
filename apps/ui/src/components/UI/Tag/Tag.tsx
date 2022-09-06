import React, { FunctionComponent } from "react";

interface TagProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Tag: FunctionComponent<TagProps> = ({ className, children, ...props }) => {
  return (
    <div className={`inline-block rounded-lg py-1 px-2 font-medium ${className}`} {...props}>
      {children}
    </div>
  );
};

export const TagBordered: FunctionComponent<TagProps> = ({ className, children, ...props }) => {
  return (
    <Tag className={`border-solid border-2 ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export const TagBorderedSm: FunctionComponent<TagProps> = ({ className, children, ...props }) => {
  return (
    <TagBordered className={`text-sm ${className}`} {...props}>
      {children}
    </TagBordered>
  );
};

export const TagBorderedLg: FunctionComponent<TagProps> = ({ className, children, ...props }) => {
  return (
    <TagBordered className={`border-4 text-4xl py-2 px-4 font-bold ${className}`} {...props}>
      {children}
    </TagBordered>
  );
};
