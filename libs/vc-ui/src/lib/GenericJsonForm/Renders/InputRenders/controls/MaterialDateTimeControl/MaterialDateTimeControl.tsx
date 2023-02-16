/*
* Origin From
https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/controls/MaterialDateTimeControl.tsx
*/
import React, { useMemo } from 'react';
import merge from 'lodash/merge';
import {
  ControlProps,
  isDateTimeControl,
  isDescriptionHidden,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormHelperText, Hidden, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getData, useFocus } from '@jsonforms/material-renderers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createOnChangeHandler } from '../../utils/datejs';
import { CalendarOrClockPickerView } from '@mui/x-date-pickers/internals/models';

interface AppliedSchemaOptions {
  focus: boolean;
  ampm: boolean;
  showUnfocusedDescription: boolean;
  hideRequiredAsterisk: boolean;
  trim: boolean;
  dateTimeFormat?: string;
  dateTimeSaveFormat?: string;
  views?: CalendarOrClockPickerView[];
}
export const MaterialDateTimeControl = (props: ControlProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    id,
    description,
    errors,
    label,
    uischema,
    visible,
    enabled,
    required,
    path,
    handleChange,
    data,
    config,
  } = props;
  const appliedUiSchemaOptions: AppliedSchemaOptions = merge(
    {},
    config,
    uischema.options
  );
  const isValid = errors.length === 0;

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const format = appliedUiSchemaOptions.dateTimeFormat ?? 'YYYY-MM-DD HH:mm';
  const saveFormat = appliedUiSchemaOptions.dateTimeSaveFormat ?? undefined;

  const views = appliedUiSchemaOptions.views ?? [
    'year',
    'day',
    'hours',
    'minutes',
  ];

  const firstFormHelperText = showDescription
    ? description
    : !isValid
    ? errors
    : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  const onChange = useMemo(
    () => createOnChangeHandler(path, handleChange, saveFormat),
    [path, handleChange, saveFormat]
  );

  const value = getData(data, saveFormat);
  return (
    <Hidden xsUp={!visible}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label={label}
          value={value}
          inputFormat={format}
          disableMaskedInput
          ampm={!!appliedUiSchemaOptions.ampm}
          views={views}
          disabled={!enabled}
          onChange={(value, input) => onChange(value, input)}
          renderInput={(params) => (
            <TextField
              {...params}
              value={data}
              focused={focused}
              id={id + '-input'}
              required={
                required && !appliedUiSchemaOptions.hideRequiredAsterisk
              }
              autoFocus={appliedUiSchemaOptions.focus}
              error={!isValid}
              fullWidth={!appliedUiSchemaOptions.trim}
              inputProps={{
                ...params.inputProps,
                type: 'text',
                'data-testid':"datetime-input"
              }}
              InputLabelProps={data ? { shrink: true } : undefined}
              onFocus={onFocus}
              onBlur={onBlur}
              variant={'outlined'}
            />
          )}
        />
        <FormHelperText
          sx={{ marginLeft: '22px' }}
          error={!isValid && !showDescription}
        >
          {firstFormHelperText}
        </FormHelperText>
        <FormHelperText sx={{ marginLeft: '22px' }} error={!isValid}>
          {secondFormHelperText}
        </FormHelperText>
      </LocalizationProvider>
    </Hidden>
  );
};

export const materialDateTimeControlTester: RankedTester = rankWith(
  2,
  isDateTimeControl
);

export default withJsonFormsControlProps(MaterialDateTimeControl);
