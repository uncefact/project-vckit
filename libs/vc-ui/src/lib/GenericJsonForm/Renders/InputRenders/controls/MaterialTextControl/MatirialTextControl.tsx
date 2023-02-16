/* Original from
* https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/controls/MaterialTextControl.tsx
*/
import React from 'react';
import {
  ControlProps,
  isStringControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { MuiInputText } from '../../mui-controls/MuiInputText';
import { MaterialInputControl } from '../MaterialInputControl/MaterialInputControl';

export const MaterialTextControl = (props: ControlProps) => (
 <MaterialInputControl {...props} input={MuiInputText} />
);

export const materialTextControlTester: RankedTester = rankWith(
  1,
  isStringControl
);
export default withJsonFormsControlProps(MaterialTextControl);
