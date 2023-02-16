/* eslint-disable @typescript-eslint/unbound-method */
/* Original from
 * https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/mui-controls/MuiSelect.tsx
 */
import React from 'react';
import { EnumCellProps, WithClassname } from '@jsonforms/core';

import { MenuItem, Select } from '@mui/material';
import merge from 'lodash/merge';

interface additionProps {
  label: string;
}

export const MuiSelect = React.memo(
  (props: EnumCellProps & WithClassname & additionProps) => {
    const {
      data,
      className,
      id,
      enabled,
      uischema,
      path,
      handleChange,
      options,
      config,
      label,
      errors,
    } = props;
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    return (
      <Select
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={appliedUiSchemaOptions.focus}
        value={data !== undefined ? data : ''}
        onChange={(ev) => handleChange(path, ev.target.value)}
        fullWidth={true}
        variant={'outlined'}
        label={label}
        error={errors ? true : false}
        inputProps={{ 'data-testid': 'select_input' }}
      >
        {options &&
          options.map((optionValue) => {
            return (
              optionValue && (
                <MenuItem value={optionValue.value} key={optionValue.value}>
                  {optionValue.label}
                </MenuItem>
              )
            );
          })}
      </Select>
    );
  }
);
