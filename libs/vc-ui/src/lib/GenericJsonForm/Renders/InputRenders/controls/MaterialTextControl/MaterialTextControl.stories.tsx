import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MaterialTextControl } from './MatirialTextControl';

const Story: ComponentMeta<typeof MaterialTextControl> = {
  component: MaterialTextControl,
  title: 'Json Forms Renderers/MaterialTextControl',
  argTypes: { handleChange: { action: 'changed' } },
};
export default Story;

const Template: ComponentStory<typeof MaterialTextControl> = (args) => (
  <MaterialTextControl {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  uischema: {
    type: 'Control',
    scope: '#/properties/sample',
  },
  schema: {
    type: 'string',
    title: 'sample',
  },
  path: 'sample',
  enabled: true,
  id: '#/properties/sample',
  errors: '',
  label: 'sample',
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
