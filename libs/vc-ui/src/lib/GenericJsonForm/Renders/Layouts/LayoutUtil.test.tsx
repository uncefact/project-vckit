import { jsonFormsTestHarness } from '../../testUtils';
import { ControlElement, GroupLayout } from '@jsonforms/core';
import { MaterialLayoutRenderer } from './LayoutUtil';

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

const layout: GroupLayout = {
  type: 'Group',
  elements: [firstControlElement, secondControlElement, thirdControlElement],
};

const emptyLayout: GroupLayout = {
  type: 'Group',
  elements: [],
};

describe('MaterialLayoutRenderer', () => {
  it('should render sub components', () => {
    const { getByTestId, debug } = jsonFormsTestHarness(
      '',
      <MaterialLayoutRenderer
        schema={jsonSchema}
        uischema={layout}
        direction="row"
        enabled
        visible
        path=""
        elements={layout.elements}
      />
    );
    debug();
    getByTestId('test-input:Name');
    getByTestId('test-input:Middle Name');
    getByTestId('test-input:Last Name');
  });
  it('should not render sub components without layout elements', () => {
    const { queryAllByTestId } = jsonFormsTestHarness(
      '',
      <MaterialLayoutRenderer
        schema={jsonSchema}
        uischema={layout}
        direction="row"
        enabled
        visible
        path=""
        elements={emptyLayout.elements}
      />
    );
    const input = queryAllByTestId('test-input:Name');
    expect(input.length).toEqual(0);
  });
  it('should match row snapshot', () => {
    const { baseElement } = jsonFormsTestHarness(
      '',
      <MaterialLayoutRenderer
        schema={jsonSchema}
        uischema={layout}
        direction="row"
        enabled
        visible
        path=""
        elements={layout.elements}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
  it('should match column snapshot', () => {
    const { baseElement } = jsonFormsTestHarness(
      '',
      <MaterialLayoutRenderer
        schema={jsonSchema}
        uischema={layout}
        direction="column"
        enabled
        visible
        path=""
        elements={layout.elements}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
