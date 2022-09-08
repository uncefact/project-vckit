import React, { ChangeEvent, FunctionComponent } from "react";
import { WidgetProps } from "@rjsf/core";

// This component has the same implementation as the default textarea widget in react-jsonschema-form.
// We want to keep most of the default behaviour of this widget and just edit the styling of the component.
export const CustomTextareaWidget: FunctionComponent<WidgetProps> = ({
  id,
  options,
  placeholder,
  value,
  required,
  disabled,
  readonly,
  autofocus,
  onChange,
  onBlur,
  onFocus,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const _onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void = ({ target: { value } }) => {
    return onChange(value === "" ? options.emptyValue : value);
  };

  return (
    <textarea
      id={id}
      className={`custom-input resize-none`}
      value={value ? value : ""}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      rows={8}
      onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
      onChange={_onChange}
    />
  );
};
