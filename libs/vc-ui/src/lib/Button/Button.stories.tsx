import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from './Button';

const Story: ComponentMeta<typeof Button> = {
  component: Button,
  title: 'Button',
};
export default Story;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Contained = Template.bind({});
Contained.args = { label: 'Contained' };

export const Outlined = Template.bind({});
Outlined.args = { label: 'Outlined', variant: 'outlined' };
