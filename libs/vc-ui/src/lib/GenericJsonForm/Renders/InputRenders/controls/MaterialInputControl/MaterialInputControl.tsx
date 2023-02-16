/* Original from
 * https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/controls/MaterialInputControl.tsx
 */
import React from 'react';
import {
  showAsRequired,
  ControlProps,
  isDescriptionHidden,
} from '@jsonforms/core';

import { Hidden, InputLabel } from '@mui/material';
import { FormControl, FormHelperText } from '@mui/material';
import merge from 'lodash/merge';
import { useFocus } from '@jsonforms/material-renderers';

export interface WithInput {
  input: any;
}

export const MaterialInputControl = (props: ControlProps & WithInput) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    id,
    description,
    errors,
    label,
    uischema,
    visible,
    required,
    config,
    input,
  } = props;
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions: {
    showUnfocusedDescription: boolean;
    hideRequiredAsterisk: boolean;
    trim: boolean;
  } = merge({}, config, uischema.options);

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const firstFormHelperText = showDescription
    ? description
    : !isValid
    ? errors
    : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;
  const InnerComponent = input;

  return (
    <Hidden xsUp={!visible}>
      <FormControl
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={onBlur}
        id={id}
        variant={'outlined'}
      >
        <InputLabel
          id="form-select-label"
          htmlFor={`${id}-input`}
          error={!isValid}
          required={showAsRequired(
            required || false,
            appliedUiSchemaOptions.hideRequiredAsterisk
          )}
          variant={'outlined'}
        >
          {label}
        </InputLabel>
        <InnerComponent
          {...props}
          id={`${id}-input`}
          labelId="form-select-label"
          isValid={isValid}
          visible={visible}
          label={label}
        />
        <FormHelperText error={!isValid && !showDescription}>
          {firstFormHelperText}
        </FormHelperText>
        <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
      </FormControl>
    </Hidden>
  );
};
