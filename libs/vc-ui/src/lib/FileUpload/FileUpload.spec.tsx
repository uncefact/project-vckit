import { FileUpload } from './FileUpload';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileData, fileToBase64 } from '../../utils';

const mockCallback = jest.fn();
const mockFileUploadProps = {
  buttonText: 'testButton',
  multiple: false,
  acceptedFiles: '.pdf',
  required: true,
  onChange: mockCallback,
};
const mockFile = new File(['(⌐□_□)'], 'mockFile.pdf', {
  type: 'application/pdf',
});

describe('FileUpload', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should render the component', () => {
    const { getByTestId } = render(<FileUpload {...mockFileUploadProps} />);

    expect(getByTestId('file-upload-button')).toBeTruthy();
  });

  it('should upload a file and call the callback function', async () => {
    const { getByTestId } = render(<FileUpload {...mockFileUploadProps} />);

    const fileData = await fileToBase64(mockFile);
    const fileUpload = getByTestId('file-upload-input') as HTMLInputElement;

    await userEvent.upload(fileUpload, mockFile);

    await waitFor(() => {
      expect(mockCallback).toBeCalledWith((fileData as FileData).dataURL);
      expect(fileUpload?.files).toHaveLength(1);
    });
  });
});
