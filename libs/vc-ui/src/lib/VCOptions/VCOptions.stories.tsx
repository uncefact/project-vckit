import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Route } from 'react-router-dom';
import { RouterWrapper } from '../../utils';
import { FormOption, VCOptions } from './VCOptions';

const Story: ComponentMeta<typeof VCOptions> = {
  component: VCOptions,
  title: 'VCOptions',
};
export default Story;

const Template: ComponentStory<typeof VCOptions> = (args) => (
  <RouterWrapper>
    <Route path="/*" element={<VCOptions {...args} />} />
  </RouterWrapper>
);

export const Primary = Template.bind({});

const form = {
  schema: {},
  uiSchema: {},
};

Primary.args = {
  forms: [{ id: '001', name: 'sampleForm', fullForm: form, partialForm: form }],
  onFormSelected: (value: FormOption) => {
    return;
  },
};
