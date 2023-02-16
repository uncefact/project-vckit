/* Original from
 * https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/controls/MaterialBooleanControl.tsx
 */
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {
  isBooleanControl,
  RankedTester,
  rankWith,
  ControlProps,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormControlLabel, Hidden } from '@mui/material';
import { MuiCheckbox } from '../../mui-controls/MuiInputCheckbox';

export const MaterialBooleanControl = ({
  data,
  visible,
  label,
  id,
  enabled,
  uischema,
  schema,
  rootSchema,
  handleChange,
  errors,
  path,
  config,
}: ControlProps) => {
  return (
    <Hidden xsUp={!visible}>
      <FormControlLabel
        label={label}
        id={id}
        control={
          <MuiCheckbox
            id={`${id}-input`}
            isValid={isEmpty(errors)}
            data={data}
            enabled={enabled}
            visible={visible}
            path={path}
            uischema={uischema}
            schema={schema}
            rootSchema={rootSchema}
            handleChange={handleChange}
            errors={errors}
            config={config}
          />
        }
      />
    </Hidden>
  );
};

export const materialBooleanControlTester: RankedTester = rankWith(
  2,
  isBooleanControl
);
export default withJsonFormsControlProps(MaterialBooleanControl);
