import { ComponentMeta, ComponentStory } from '@storybook/react';
import { QrCode } from './QrCode';

const Story: ComponentMeta<typeof QrCode> = {
  component: QrCode,
  title: 'QRCode',
};
export default Story;

const Template: ComponentStory<typeof QrCode> = (args) => <QrCode {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  url: 'test-url',
  qrCodeOptions: { width: 200 },
};
