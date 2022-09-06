import React, { useState, FunctionComponent } from "react";
import { Dropdown, DropdownItem } from "@govtechsg/tradetrust-ui-components";
import { WidgetProps } from "@rjsf/core";

interface Option {
  label: string;
  value: string;
}

interface Options {
  enumOptions: Option[];
}

export const CustomDropdownWidget: FunctionComponent<WidgetProps> = (props) => {
  const { options, onChange } = props;
  const opts = options as unknown as Options;
  const [dropdownButtonText, setDropdownButtonText] = useState("Select One");

  return (
    <Dropdown
      dropdownButtonText={dropdownButtonText}
      classNameRoot="w-full"
      className="border-gray-300 border-solid border rounded-none py-2 px-3 hover:bg-gray-50 rounded-lg"
      classNameShared="w-full"
    >
      {opts.enumOptions.map((option, index) => {
        return (
          <DropdownItem
            key={index}
            onClick={() => {
              onChange(option.value);
              setDropdownButtonText(option.label);
            }}
          >
            {option.label}
          </DropdownItem>
        );
      })}
    </Dropdown>
  );
};
