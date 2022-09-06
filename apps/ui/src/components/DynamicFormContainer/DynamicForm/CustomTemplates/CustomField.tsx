import React, { FunctionComponent } from "react";
import { FieldTemplateProps } from "@rjsf/core";

export const CustomFieldTemplate: FunctionComponent<FieldTemplateProps> = ({
  id,
  classNames,
  label,
  help,
  required,
  description,
  errors,
  children,
  schema,
}) => {
  return (
    <div className={classNames} data-testid={classNames}>
      {!schema.format && schema.type !== "object" && schema.type !== "array" && schema.type !== "boolean" && (
        <label htmlFor={id}>
          {label}
          {required ? "*" : null}
        </label>
      )}
      {schema.format && <legend>{schema.title}</legend>}
      {description}
      {children}
      {errors}
      {help}
    </div>
  );
};
