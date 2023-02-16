/*
* Original from
* https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/controls/MaterialNumberControl.tsx
*/

import React from 'react';
import {
  ControlProps,
  isNumberControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { MuiInputNumber } from '../../mui-controls/MuiInputNumber';
import { MaterialInputControl } from '../MaterialInputControl/MaterialInputControl';
import { withJsonFormsControlProps } from '@jsonforms/react';

export const MaterialNumberControl = (props: ControlProps) => (
  <MaterialInputControl {...props} input={MuiInputNumber} />
);

export const materialNumberControlTester: RankedTester = rankWith(
  2,
  isNumberControl
);

export default withJsonFormsControlProps(MaterialNumberControl);
