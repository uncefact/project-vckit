import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PdfViewer } from './PdfViewer';
import { AANZFTA_COO_PARTIAL } from '../fixtures';

const Story: ComponentMeta<typeof PdfViewer> = {
  component: PdfViewer,
  title: 'PdfViewer',
};
export default Story;

const Template: ComponentStory<typeof PdfViewer> = (args) => (
  <PdfViewer {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  document: AANZFTA_COO_PARTIAL,
};
