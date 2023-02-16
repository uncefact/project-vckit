import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PdfUploadWidgetControl } from './PdfUploadWidgetControl';
import { useState } from 'react';

const Story: ComponentMeta<typeof PdfUploadWidgetControl> = {
  component: PdfUploadWidgetControl,
  title: 'Json Forms Renderers/PdfUploadWidgetControl',
};
export default Story;

const Template: ComponentStory<typeof PdfUploadWidgetControl> = (args) => {
  const [data, setData] = useState('');

  return (
    <PdfUploadWidgetControl
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
  data: '',
  path: '',
  errors: '',
  required: false,
};
