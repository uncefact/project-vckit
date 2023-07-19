import { QrCodeDocumentWrapper } from '../src/components/QrCodeDocumentWrapper';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'QrCodeDocumentWrapper',
  component: QrCodeDocumentWrapper,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    qrCodeValue: {
      description: 'The value to be encoded in the QR code',
    },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = {
  args: {
    qrCodeValue:
      'http://localhost:4200/verify?q=%7B%22payload%22%3A%7B%22uri%22%3A%22http%3A%2F%2Flocalhost%3A3332%2Fencrypted-storage%2Fencrypted-data%2Ff0754961-d831-411e-8596-786bf9a01aa2%22%2C%22key%22%3A%22ec6065ccf59c8cf466b23ca666813de69238c1f54eff927fa6f04316e55a3fd3%22%7D%7D',
  },
  render: ({ data, ...args }) => (
    <QrCodeDocumentWrapper {...args}>
      <div dangerouslySetInnerHTML={{ __html: '<h1>hello world</h1>' }}></div>
    </QrCodeDocumentWrapper>
  ),
};
