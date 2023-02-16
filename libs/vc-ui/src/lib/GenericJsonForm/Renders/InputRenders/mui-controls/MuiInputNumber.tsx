/**
 * Original from
 *  https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/mui-controls/MuiInputNumber.tsx
 */

import React from 'react';
import { CellProps, WithClassname } from '@jsonforms/core';
import { OutlinedInput } from '@mui/material';
import merge from 'lodash/merge';
import { useDebouncedChange } from '@jsonforms/material-renderers';

const toNumber = (value: string) =>
    value === '' ? undefined : parseFloat(value);
const eventToValue = (ev:React.ChangeEvent<HTMLInputElement>) => toNumber(ev.target.value);
export const MuiInputNumber = React.memo((props: CellProps & WithClassname & { label: string}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    data,
    className,
    id,
    enabled,
    uischema,
    path,
    handleChange,
    config,
    label
  } = props;
  const inputProps = { step: '0.1', 'data-testid': "testNumberInput" };

  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const [inputValue, onChange] = useDebouncedChange(handleChange, '', data, path, eventToValue);

  return (
    <OutlinedInput
      type='number'
      value={inputValue}
      onChange={onChange}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      inputProps={inputProps}
      fullWidth={true}
      label={label}
    />
  );
});
