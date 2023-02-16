import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { CertificateUpload } from './CertificateUpload';

const Story: ComponentMeta<typeof CertificateUpload> = {
  component: CertificateUpload,
  title: 'CertificateUpload',
};
export default Story;

export const Primary: ComponentStory<typeof CertificateUpload> = () => (
  <CertificateUpload acceptMessage="Max 3MB" handleFiles={() => null} />
);

export const Error: ComponentStory<typeof CertificateUpload> = () => (
  <CertificateUpload
    errorMessage="Something went wrong"
    handleFiles={() => null}
  />
);
