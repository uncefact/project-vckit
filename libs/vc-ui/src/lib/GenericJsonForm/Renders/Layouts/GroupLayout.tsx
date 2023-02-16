import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { Hidden, Typography } from '@mui/material';
import {
  GroupLayout,
  LayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
  withIncreasedRank,
} from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import {
  MaterialLayoutRenderer,
  MaterialLabelableLayoutRendererProps,
} from './LayoutUtil';

const GroupComponent = React.memo(
  ({
    visible,
    enabled,
    uischema,
    label,
    ...props
  }: MaterialLabelableLayoutRendererProps) => {
    const groupLayout = uischema as GroupLayout;
    return (
      <Hidden xsUp={!visible}>
        {!isEmpty(label) && (
          <Typography
            sx={{ fontSize: '18px', fontWeight: 'bold', marginY: '14px' }}
          >
            {label}
          </Typography>
        )}
        <MaterialLayoutRenderer
          {...props}
          visible={visible}
          enabled={enabled}
          elements={groupLayout.elements}
        />
      </Hidden>
    );
  }
);

export const MaterializedGroupLayoutRenderer = ({
  uischema,
  schema,
  path,
  visible,
  enabled,
  renderers,
  cells,
  direction,
  label,
}: LayoutProps) => {
  const groupLayout = uischema as GroupLayout;

  return (
    <GroupComponent
      elements={groupLayout.elements}
      schema={schema}
      path={path}
      direction={direction}
      visible={visible}
      enabled={enabled}
      uischema={uischema}
      renderers={renderers}
      cells={cells}
      label={label}
    />
  );
};

export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export default withJsonFormsLayoutProps(MaterializedGroupLayoutRenderer);

export const materialGroupTester: RankedTester = withIncreasedRank(
  1,
  groupTester
);
