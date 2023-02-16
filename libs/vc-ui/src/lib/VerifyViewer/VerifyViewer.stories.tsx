import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { CHAFTA_COO } from '../fixtures';
import { VerifyViewer } from './VerifyViewer';

const Story: ComponentMeta<typeof VerifyViewer> = {
  component: VerifyViewer,
  title: 'VerifyViewer',
};
export default Story;

const Template: ComponentStory<typeof VerifyViewer> = (args) => (
  <VerifyViewer {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  document: CHAFTA_COO,
  results: {
    issuer: { id: 'did:key:123' },
    checks: ['proof', 'status'],
    errors: [],
    warnings: [],
  },
};

export const Invalid = Template.bind({});

Invalid.args = {
  document: CHAFTA_COO,
  results: {
    issuer: { id: 'did:key:123' },
    checks: ['proof'],
    errors: ['proof'],
    warnings: [],
  },
};
