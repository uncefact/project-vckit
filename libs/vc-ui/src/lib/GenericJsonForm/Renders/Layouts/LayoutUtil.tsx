import isEmpty from 'lodash/isEmpty';
import React from 'react';
import type { UISchemaElement } from '@jsonforms/core';
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  OwnPropsOfRenderer,
} from '@jsonforms/core';
import { JsonFormsDispatch } from '@jsonforms/react';
import { Grid, Hidden } from '@mui/material';

export const renderLayoutElements = (
  elements: UISchemaElement[],
  schema?: JsonSchema,
  path?: string,
  enabled?: boolean,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[]
) => {
  return elements.map((child, index) => (
    <Grid item key={`${path}-${index}`} xs>
      <JsonFormsDispatch
        uischema={child}
        schema={schema}
        path={path}
        enabled={enabled}
        renderers={renderers}
        cells={cells}
      />
    </Grid>
  ));
};

export interface MaterialLayoutRendererProps extends OwnPropsOfRenderer {
  elements: UISchemaElement[];
  direction: 'row' | 'column';
}
const MaterialLayoutRendererComponent =
  ({
    visible,
    elements,
    schema,
    path,
    enabled,
    direction,
    renderers,
    cells
  }: MaterialLayoutRendererProps) => {
    if (isEmpty(elements)) {
      return null;
    } else {
      return (
        <Hidden xsUp={!visible}>
          <Grid
            container
            direction={direction}
            spacing={direction === 'row' ? 2 : 0}
          >
            {renderLayoutElements(
              elements,
              schema,
              path,
              enabled,
              renderers,
              cells
            )}
          </Grid>
        </Hidden>
      );
    }
  };
export const MaterialLayoutRenderer = React.memo(MaterialLayoutRendererComponent);


export interface MaterialLabelableLayoutRendererProps extends MaterialLayoutRendererProps {
  label?: string;
}
