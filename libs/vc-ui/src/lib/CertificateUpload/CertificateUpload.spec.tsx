import { fireEvent, render, waitFor } from '@testing-library/react';
import { CertificateUpload } from './CertificateUpload';

const handleFiles = jest.fn();
const ACCEPT_MESSAGE = 'Max 3MB';
const ERROR_MESSAGE = 'Something went wrong';

describe('CertificateUpload', () => {
  it('should render correctly', () => {
    const { baseElement } = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage=""
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should display error message if present', () => {
    let baseElement = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage=""
      />
    );

    expect(baseElement.queryByText('Something went wrong')).toBeFalsy();

    baseElement = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage={ERROR_MESSAGE}
      />
    );

    expect(baseElement.queryByText('Something went wrong')).toBeTruthy();
  });

  it('should call handleFiles on upload', async () => {
    const baseElement = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage=""
      />
    );

    const uploadElement = baseElement.getByTestId('input-file-upload');

    await waitFor(() =>
      fireEvent.change(uploadElement, {
        target: { files: ['{"test": "hello"}'] },
      })
    );

    expect(handleFiles).toHaveBeenCalledWith(['{"test": "hello"}']);
  });
});
