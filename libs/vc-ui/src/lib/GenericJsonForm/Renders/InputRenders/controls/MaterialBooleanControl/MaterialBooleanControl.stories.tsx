import { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MaterialBooleanControl } from './MaterialBooleanControl';

const Story: ComponentMeta<typeof MaterialBooleanControl> = {
  component: MaterialBooleanControl,
  title: 'Json Forms Renderers/MaterialBooleanControl',
};
export default Story;

const Template: ComponentStory<typeof MaterialBooleanControl> = (args) => {
  const [data, setData] = useState(false);
  const handleChange = (path: string, value: boolean) => {
    setData(value);
  };
  return (
    <MaterialBooleanControl {...args} data={data} handleChange={handleChange} />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  uischema: {
    type: 'Control',
    scope: '#/properties/sample',
  },
  schema: {
    type: 'boolean',
  },
  path: 'sample',
  enabled: true,
  id: '#/properties/sample',
  errors: '',
  label: 'Sample boolean control',
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
        type: 'boolean',
      },
    },
  },
};
