import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { validResults, invalidResults } from '../fixtures';
import { VerifyResults } from './VerifyResults';

const Story: ComponentMeta<typeof VerifyResults> = {
  component: VerifyResults,
  title: 'VerifyResults',
};
export default Story;

const Template: ComponentStory<typeof VerifyResults> = (args) => (
  <VerifyResults {...args} />
);

export const Valid = Template.bind({});

Valid.args = validResults;

export const Invalid = Template.bind({});
Invalid.args = invalidResults;
