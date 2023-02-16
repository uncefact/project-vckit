import { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MaterialEnumControl } from './MaterialEnumControl';

const Story: ComponentMeta<typeof MaterialEnumControl> = {
  component: MaterialEnumControl,
  title: 'Json Forms Renderers/MaterialEnumControl',
};
export default Story;

const Template: ComponentStory<typeof MaterialEnumControl> = (args) => {
  const [data, setData] = useState('');
  const handleChange = (path: string, value: string) => {
    setData(value);
  };
  return (
    <MaterialEnumControl {...args} data={data} handleChange={handleChange} />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  uischema: {
    type: 'Control',
    scope: '#/properties/sample',
  },
  schema: {
    type: 'string',
    enum: ['Option 1', 'Option 2', 'Option 3'],
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
        enum: ['Option 1', 'Option 2', 'Option 3'],
      },
    },
  },
  options: [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' },
    { label: 'Option 3', value: 'Option 3' },
  ],
};
