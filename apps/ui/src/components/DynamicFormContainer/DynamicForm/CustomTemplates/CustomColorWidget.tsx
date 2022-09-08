import React, { ChangeEvent, FunctionComponent } from "react";
import { WidgetProps } from "@rjsf/core";

export const CustomColorWidget: FunctionComponent<WidgetProps> = ({
  id,
  options,
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
  const _onChange: (event: ChangeEvent<HTMLInputElement>) => void = ({ target: { value } }) => {
    return onChange(value === "" ? options.emptyValue : value);
  };

  return (
    <input
      id={id}
      type="color"
      className="block form-control h-10 w-24"
      readOnly={readonly}
      disabled={disabled}
      required={required}
      autoFocus={autofocus}
      value={value == null ? options.emptyValue : value}
      onChange={_onChange}
      onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
      data-testid="custom-color-widget"
    />
  );
};
