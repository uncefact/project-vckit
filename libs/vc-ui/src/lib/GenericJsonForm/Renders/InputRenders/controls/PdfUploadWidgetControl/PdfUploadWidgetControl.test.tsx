/* eslint-disable @typescript-eslint/require-await */
import { act, screen, waitFor } from '@testing-library/react';
import { PdfUploadWidgetControl } from './PdfUploadWidgetControl';
import {
  samplePropsInputFields,
  jsonFormsTestHarness,
} from '../../../../testUtils';
import { AANZFTA_COO_PARTIAL } from '../../../../../fixtures/documents';

const mockCallback = jest.fn();

const sampleProps = {
  ...samplePropsInputFields,
  uischema: {
    ...samplePropsInputFields.uischema,
    options: { widget: 'fileUpload' },
  },
};

const originalDocument: string =
  AANZFTA_COO_PARTIAL?.credentialSubject?.['originalDocument'];

describe('PdfUploadWidgetControl', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should render the component', async () => {
    await act(async () => {
      jsonFormsTestHarness(
        '',
        <PdfUploadWidgetControl handleChange={mockCallback} {...sampleProps} />
      );
    });

    expect(screen.getByTestId('file-upload-button')).toBeTruthy();
  });

  it('should display the PDF renderer when there is data', async () => {
    await act(async () => {
      jsonFormsTestHarness(
        '',
        <PdfUploadWidgetControl
          handleChange={mockCallback}
          {...sampleProps}
          data={originalDocument}
        />
      );
    });
    await waitFor(() => {
      expect(screen.getByText('Document Preview')).toBeTruthy();
      expect(screen.getByTestId('pdf-container')).toBeTruthy();
      expect(screen.getByTestId('page_1')).toBeTruthy();
    });
  });
});
