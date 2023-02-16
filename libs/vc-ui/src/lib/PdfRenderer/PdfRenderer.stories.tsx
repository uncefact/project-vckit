import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PdfRenderer } from './PdfRenderer';
import { AANZFTA_COO_PARTIAL } from '../fixtures';

const Story: ComponentMeta<typeof PdfRenderer> = {
  component: PdfRenderer,
  title: 'PdfRenderer',
};
export default Story;

const Template: ComponentStory<typeof PdfRenderer> = (args) => (
  <PdfRenderer {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  pdfDocument: AANZFTA_COO_PARTIAL.credentialSubject['originalDocument'],
};
