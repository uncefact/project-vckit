import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FileUpload } from './FileUpload';

const Story: ComponentMeta<typeof FileUpload> = {
  component: FileUpload,
  title: 'FileUpload',
};
export default Story;

const Template: ComponentStory<typeof FileUpload> = (args) => (
  <FileUpload {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  buttonText: 'Upload Document',
  multiple: false,
  acceptedFiles: '.pdf',
  onChange: (value: string | string[]) => {
    return;
  },
};
