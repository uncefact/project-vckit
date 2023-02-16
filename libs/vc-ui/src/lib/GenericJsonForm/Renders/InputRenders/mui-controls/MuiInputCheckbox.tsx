/* eslint-disable @typescript-eslint/unbound-method */
/* Original from
 * https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/mui-controls/MuiCheckbox.tsx
 */
import React from 'react';
import { CellProps, WithClassname } from '@jsonforms/core';
import { Checkbox } from '@mui/material';
import merge from 'lodash/merge';

export const MuiCheckbox = React.memo((props: CellProps & WithClassname) => {
  const { data, className, id, enabled, uischema, path, handleChange, config } =
    props;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const inputProps = {
    autoFocus: !!appliedUiSchemaOptions.focus,
    'data-testid': 'testCheckboxInput',
  };
  // !! causes undefined value to be converted to false, otherwise has no effect
  const checked = !!data;
  return (
    <Checkbox
      checked={checked}
      onChange={(_ev, isChecked) => handleChange(path, isChecked)}
      className={className}
      id={id}
      disabled={!enabled}
      inputProps={inputProps}
      required={true}
    />
  );
});
