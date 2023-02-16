import { ControlElement, HorizontalLayout } from '@jsonforms/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MaterializedGroupLayoutRenderer } from './GroupLayout';


const jsonSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    personalData: {
      type: 'object',
      properties: {
        middleName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        }
      },
      required: ['middleName', 'lastName']
    }
  },
  required: ['name']
};

const firstControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/name'
};
const secondControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/personalData/properties/middleName'
};
const thirdControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/personalData/properties/lastName'
};

const layout: HorizontalLayout = {
  type: 'HorizontalLayout',
  elements: [firstControlElement, secondControlElement, thirdControlElement]
};



const Story: ComponentMeta<typeof MaterializedGroupLayoutRenderer> = {
  component: MaterializedGroupLayoutRenderer,
  title: 'Json Forms Renderers/MaterializedGroupLayoutRenderer',
};
export default Story;

const Template: ComponentStory<typeof MaterializedGroupLayoutRenderer> = (args) => (
  <MaterializedGroupLayoutRenderer {...args}  direction={'row'} />
);

export const Primary = Template.bind({});

Primary.args = {
  uischema: layout,
  schema: jsonSchema,
  path: 'sample',
  enabled: true,
  visible: true,
};

