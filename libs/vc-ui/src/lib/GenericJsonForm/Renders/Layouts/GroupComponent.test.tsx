import { jsonFormsTestHarness } from '../../testUtils';
import { ControlElement, HorizontalLayout } from '@jsonforms/core';
import { MaterializedGroupLayoutRenderer } from './GroupLayout';

const jsonSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    personalData: {
      type: 'object',
      properties: {
        middleName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
      },
      required: ['middleName', 'lastName'],
    },
  },
  required: ['name'],
};

const firstControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/name',
};
const secondControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/personalData/properties/middleName',
};
const thirdControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/personalData/properties/lastName',
};

const layout: HorizontalLayout = {
  type: 'HorizontalLayout',
  elements: [firstControlElement, secondControlElement, thirdControlElement],
};

describe('MaterializedGroupLayoutRenderer', () => {
  it('should render sub components', () => {
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <MaterializedGroupLayoutRenderer
        schema={jsonSchema}
        uischema={layout}
        direction="row"
        enabled
        visible
        path=""
      />
    );
    getByTestId('test-input:Name');
    getByTestId('test-input:Last Name');
    getByTestId('test-input:Middle Name');
  });
});
