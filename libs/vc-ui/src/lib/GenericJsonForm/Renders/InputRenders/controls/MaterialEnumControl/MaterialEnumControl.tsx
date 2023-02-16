/* Original from
 * https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/controls/MaterialEnumControl.tsx
 */
import {
  ControlProps,
  isEnumControl,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsEnumProps } from '@jsonforms/react';
import { MuiSelect } from '../../mui-controls/MuiInputSelect';
import { MaterialInputControl } from '../MaterialInputControl/MaterialInputControl';

export const MaterialEnumControl = (props: ControlProps & OwnPropsOfEnum) => {
  return <MaterialInputControl {...props} input={MuiSelect} />;
};

export const materialEnumControlTester: RankedTester = rankWith(
  2,
  isEnumControl
);

export default withJsonFormsEnumProps(MaterialEnumControl);
