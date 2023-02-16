/* eslint-disable @typescript-eslint/require-await */
import { render, act, waitFor, screen } from '@testing-library/react';
import { PdfViewer } from './PdfViewer';
import { AANZFTA_COO_PARTIAL } from '../fixtures';

describe('PdfViewer', () => {
  it('should display VcUtility component and PdfRenderer', async () => {
    await act(async () => {
      render(<PdfViewer document={AANZFTA_COO_PARTIAL} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('vc-utility')).toBeTruthy();
      expect(screen.getByTestId('pdf-container')).toBeTruthy();
    });
  });

  it('should display a QrCode in the pdf container', async () => {
    await act(async () => {
      render(<PdfViewer document={AANZFTA_COO_PARTIAL} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('vc-utility')).toBeTruthy();
      expect(screen.getByTestId('pdf-container')).toBeTruthy();
      expect(screen.getByTestId('qr-code-element')).toBeTruthy();
    });
  });
});
