import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { RendererViewer } from './RendererViewer';
import { CHAFTA_COO } from '../fixtures';

const Story: ComponentMeta<typeof RendererViewer> = {
  component: RendererViewer,
  title: 'RendererViewer',
};
export default Story;

const Template: ComponentStory<typeof RendererViewer> = (args) => (
  <RendererViewer {...args} />
);

export const Primary = Template.bind({});

Primary.args = { document: CHAFTA_COO };
