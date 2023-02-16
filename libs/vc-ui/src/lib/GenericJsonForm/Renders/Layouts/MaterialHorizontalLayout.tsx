/*
* Original From:
* https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/layouts/MaterialHorizontalLayout.tsx
*/
import React from 'react';
import {
  HorizontalLayout,
  LayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
  VerticalLayout,
} from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { useMediaQuery } from '@mui/material';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from '@jsonforms/material-renderers';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const materialHorizontalLayoutTester: RankedTester = rankWith(
  2,
  uiTypeIs('HorizontalLayout')
);

export const MaterialHorizontalLayoutRenderer = ({ uischema, renderers, cells, schema, path, enabled, visible }: LayoutProps) => {
  const matches = useMediaQuery('(min-width:700px)');
  const layout = matches?  uischema as HorizontalLayout : uischema as VerticalLayout;
  const childProps: MaterialLayoutRendererProps = {
    elements: layout.elements,
    schema,
    path,
    enabled,
    direction: matches ? 'row' : 'column',
    visible
  };
  return <MaterialLayoutRenderer {...childProps} renderers={renderers} cells={cells} />;

};

export default withJsonFormsLayoutProps(MaterialHorizontalLayoutRenderer);

