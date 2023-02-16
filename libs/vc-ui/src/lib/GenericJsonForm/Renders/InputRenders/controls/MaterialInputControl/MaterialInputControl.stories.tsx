import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MuiInputText } from '../../mui-controls/MuiInputText';
import { MaterialInputControl } from './MaterialInputControl';

const Story: ComponentMeta<typeof MaterialInputControl> = {
  component: MaterialInputControl,
  title: 'Json Forms Renderers/MaterialInputControl',
  argTypes: { handleChange: { action: 'changed' } },
};
export default Story;

const Template: ComponentStory<typeof MaterialInputControl> = (args) => (
  <MaterialInputControl {...args} input={MuiInputText} />
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
