import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MaterialNumberControl } from './MaterialNumberControl';

const Story: ComponentMeta<typeof MaterialNumberControl> = {
  component: MaterialNumberControl,
  title: 'Json Forms Renderers/MaterialNumberControl',
  argTypes: { handleChange: { action: 'changed' } },
};
export default Story;

const Template: ComponentStory<typeof MaterialNumberControl> = (args) => (
  <MaterialNumberControl {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  uischema: {
    type: 'Control',
    scope: '#/properties/sample',
    label: 'Sample Number',
  },
  schema: {
    type: 'number',
  },
  path: 'sample',
  enabled: true,
  id: '#/properties/sample',
  errors: 'sample',
  label: 'Sample',
  visible: true,
  required: true,
  config: {
    restrict: false,
    trim: false,
    showUnfocusedDescription: false,
    hideRequiredAsterisk: false,
  },
  rootSchema: {
    type: 'object',
    properties: {
      sample: {
        type: 'string',
        title: 'sample',
      },
    },
    required: [
      'sample',
    ],
  },
};
