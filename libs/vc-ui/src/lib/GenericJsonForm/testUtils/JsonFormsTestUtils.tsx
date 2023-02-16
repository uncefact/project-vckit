import { createAjv, ControlElement } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import React from 'react';
import { Renderers } from '../Renders';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { jsonFormTheme } from '../../../theme';

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

export const testUISchema: ControlElement = {
  type: 'Control',
  scope: '#/properties/sample',
};

export const testRootSchema = {
  type: 'object',
  properties: {
    sample: {
      type: 'string',
      title: 'sample',
    },
  },
};
export const testRootSchemaRequired = {
  type: 'object',
  properties: {
    sample: {
      type: 'string',
      title: 'sample',
    },
  },
  required: ['sample'],
};
export const testSchemaRestrictedLength = {
  type: 'object',
  properties: {
    sample: {
      type: 'string',
      title: 'sample',
      maxLength: 5,
    },
  },
};

export const samplePropsInputFields = {
  uischema: testUISchema,
  schema: {
    type: 'Control',
    format: 'date-time',
  },
  path: 'sample',
  data: '',
  enabled: true,
  id: '#/properties/sample',
  errors: '',
  label: 'sample',
  visible: true,
  required: false,
  isValid: true,
  config: {
    restrict: false,
    trim: false,
    showUnfocusedDescription: false,
    hideRequiredAsterisk: false,
  },
  rootSchema: testRootSchema,
};

export const samplePropsInputFieldsRequired = {
  ...samplePropsInputFields,
  required: true,
  errors: 'required',
};

export const samplePropsInputFieldsRestrictedLength = {
  uischema: testUISchema,
  schema: {
    type: 'string',
    title: 'sample',
    maxLength: 5,
  },
  path: 'sample',
  data: '',
  enabled: true,
  id: '#/properties/sample',
  errors: '',
  label: 'sample',
  visible: true,
  required: false,
  isValid: true,
  config: {
    restrict: true,
    trim: true,
    showUnfocusedDescription: false,
    hideRequiredAsterisk: false,
  },
  rootSchema: testSchemaRestrictedLength,
};

export const initCore = (required = false, data?: any) => {
  if (required)
    return {
      schema: testRootSchemaRequired,
      uiSchema: testUISchema,
      data,
      ajv: createAjv(),
    };
  return {
    schema: testRootSchema,
    uiSchema: testUISchema,
    data,
    ajv: createAjv(),
  };
};

export const jsonFormsTestHarness = (
  data: any,
  child: React.ReactNode,
  required = false
) => {
  const core = initCore(required, data);
  return render(
    <ThemeProvider theme={jsonFormTheme}>
      <JsonFormsStateProvider initState={{ renderers: Renderers, core }}>
        {child}
      </JsonFormsStateProvider>
    </ThemeProvider>
  );
};
