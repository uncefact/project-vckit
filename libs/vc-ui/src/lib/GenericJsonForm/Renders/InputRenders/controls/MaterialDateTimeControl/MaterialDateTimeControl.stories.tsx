import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MaterialDateTimeControl } from './MaterialDateTimeControl';

const Story: ComponentMeta<typeof MaterialDateTimeControl> = {
  component: MaterialDateTimeControl,
  title: 'Json Forms Renderers/MaterialDateTimeControl',
  argTypes: { handleChange: { action: 'changed' } },
};
export default Story;

const Template: ComponentStory<typeof MaterialDateTimeControl> = (args) => (
  <MaterialDateTimeControl {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  uischema: {
    type: 'Control',
    scope: '#/properties/sample',
  },
  schema: {
    type: 'string',
    format: 'date-time',
  },
  path: 'sample',
  enabled: true,
  id: '#/properties/sample',
  errors: '',
  label: 'Sample',
  visible: true,
  required: false,
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
  },
};
