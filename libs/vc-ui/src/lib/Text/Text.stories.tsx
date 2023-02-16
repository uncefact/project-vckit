import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Text } from './Text';

const Story: ComponentMeta<typeof Text> = {
  component: Text,
  title: 'Text',
};
export default Story;

export const Default: ComponentStory<typeof Text> = () => <Text>Default</Text>;

export const Header5: ComponentStory<typeof Text> = () => (
  <Text variant="h5">Header5</Text>
);
