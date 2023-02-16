import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AANZFTA_COO } from '../fixtures';
import { VcUtility } from './VcUtility';

const Story: ComponentMeta<typeof VcUtility> = {
  component: VcUtility,
  title: 'VcUtility',
};
export default Story;

const Template: ComponentStory<typeof VcUtility> = (args) => (
  <VcUtility {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  document: AANZFTA_COO,
  onPrint: () => ({}),
  isPrintable: true,
};
