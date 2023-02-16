/* Original from
 * https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/mui-controls/MuiInputText.tsx
 */
import React, { useState } from 'react';
import { CellProps, WithClassname } from '@jsonforms/core';
import {
  IconButton,
  InputAdornment,
  InputBaseComponentProps,
  InputProps,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import merge from 'lodash/merge';
import Close from '@mui/icons-material/Close';
import { JsonFormsTheme } from '@jsonforms/material-renderers';
import { useDebouncedChange } from '../utils/debounce';

interface MuiTextInputProps {
  muiInputProps?: InputProps['inputProps'];
  inputComponent?: InputProps['inputComponent'];
  label: string;
}
export const MuiInputText = React.memo(
  (props: CellProps & WithClassname & MuiTextInputProps) => {
    const [showAdornment, setShowAdornment] = useState(false);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {
      data,
      config,
      className,
      id,
      enabled,
      uischema,
      isValid,
      path,
      handleChange,
      schema,
      muiInputProps,
    } = props;
    const maxLength = schema.maxLength;
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    let inputProps: InputBaseComponentProps;
    if (appliedUiSchemaOptions.restrict) {
      inputProps = { maxLength: maxLength };
    } else {
      inputProps = {};
    }

    inputProps = merge(inputProps, muiInputProps, {
      'data-testid': `test-input:${props['label']}`,
    });

    if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
      inputProps['size'] = maxLength;
    }

    const [inputText, onChange, onClear] = useDebouncedChange(
      handleChange,
      '',
      data,
      path
    );
    const onPointerEnter = () => setShowAdornment(true);
    const onPointerLeave = () => setShowAdornment(false);

    const theme: JsonFormsTheme = useTheme();

    const closeStyle = {
      background:
        theme.jsonforms?.input?.delete?.background ||
        theme.palette.background.default,
      borderRadius: '50%',
    };

    return (
      <OutlinedInput
        type={
          appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'
        }
        value={inputText}
        onChange={onChange}
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={appliedUiSchemaOptions.focus}
        multiline={appliedUiSchemaOptions.multi}
        fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
        label={props['label']}
        error={!isValid}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        endAdornment={
          <InputAdornment
            position="end"
            style={{
              display: !showAdornment ? 'none' : 'flex',
              position: 'absolute',
              right: 0,
            }}
          >
            <IconButton
              aria-label="Clear input field"
              onClick={onClear}
              size="large"
              data-testid="clearFieldButton"
            >
              <Close style={closeStyle} />
            </IconButton>
          </InputAdornment>
        }
        inputProps={inputProps}
      />
    );
  }
);
