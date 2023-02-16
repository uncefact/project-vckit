import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AbnWidgetControl } from './AbnWidgetContol';
import { useState } from 'react';

const Story: ComponentMeta<typeof AbnWidgetControl> = {
  component: AbnWidgetControl,
  title: 'Json Forms Renderers/AbnWidgetControl',
};
export default Story;

const Template: ComponentStory<typeof AbnWidgetControl> = (args) => {
  const [data, setData] = useState('');

  return (
    <AbnWidgetControl
      {...args}
      data={data}
      handleChange={(path: string, value: string) => {
        setData(value);
      }}
    />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  uischema: {
    type: 'Control',
    scope: '#/properties/abn',
    options: { widget: 'ABN', widgetLink: 'www.example.com' },
  },
  schema: {
    type: 'string',
    title: 'ABN',
  },
  path: 'sample',
  enabled: true,
  id: '#/properties/sample',
  errors: '',
  label: 'ABN',
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
      abn: {
        type: 'string',
        title: 'ABN',
      },
    },
  },
};
