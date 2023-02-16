import { act, render } from '@testing-library/react';
import * as utils from '../../utils';
import { AANZFTA_COO } from '../fixtures/documents';
import { VcUtility } from './VcUtility';

const mockOnPrint = jest.fn();
const mockCopyToClipboard = jest
  .spyOn(utils, 'copyToClipboard')
  .mockImplementation(() => Promise.resolve());

const vcSelfLink = AANZFTA_COO.credentialSubject.links?.self?.href ?? '';

describe('VcUtility', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VcUtility
        document={AANZFTA_COO}
        onPrint={mockOnPrint}
        isPrintable={true}
      />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should display qrcode, print and download button if self link exists', () => {
    const { getByTestId } = render(
      <VcUtility
        document={AANZFTA_COO}
        onPrint={mockOnPrint}
        isPrintable={true}
      />
    );

    expect(getByTestId('uri-dropdown-button')).toBeTruthy();
    expect(getByTestId('print-button')).toBeTruthy();
    expect(getByTestId('download-button')).toBeTruthy();
  });

  it('should only display print and download button if self link does not exists', () => {
    const { queryByTestId, getByTestId } = render(
      <VcUtility
        document={{
          ...AANZFTA_COO,
          credentialSubject: { ...AANZFTA_COO.credentialSubject, links: {} },
        }}
        onPrint={mockOnPrint}
        isPrintable={true}
      />
    );
    expect(queryByTestId('uri-dropdown-button')).toBeNull();
    expect(getByTestId('print-button')).toBeTruthy();
    expect(getByTestId('download-button')).toBeTruthy();
  });

  it('should only display print button if isPrintable', () => {
    const { queryByTestId, getByTestId } = render(
      <VcUtility
        document={AANZFTA_COO}
        onPrint={mockOnPrint}
        isPrintable={false}
      />
    );
    expect(queryByTestId('print-button')).toBeNull();
    expect(getByTestId('uri-dropdown-button')).toBeTruthy();
    expect(getByTestId('download-button')).toBeTruthy();
  });

  it('should display uri and qrcode when dropdown button is clicked', () => {
    const { getByTestId, getByDisplayValue } = render(
      <VcUtility
        document={AANZFTA_COO}
        onPrint={mockOnPrint}
        isPrintable={true}
      />
    );
    act(() => {
      getByTestId('uri-dropdown-button').click();
    });

    expect(getByDisplayValue(vcSelfLink)).toBeTruthy();
    expect(getByTestId('copy-uri-button')).toBeTruthy();
    expect(getByTestId('qrcode')).toBeTruthy();
  });

  it('should call the copyToClipboard function when copy uri button is clicked', () => {
    const { getByTestId } = render(
      <VcUtility
        document={AANZFTA_COO}
        onPrint={mockOnPrint}
        isPrintable={true}
      />
    );
    act(() => {
      getByTestId('uri-dropdown-button').click();
      getByTestId('copy-uri-button').click();
    });

    expect(mockCopyToClipboard).toBeCalledTimes(1);
    expect(mockCopyToClipboard).toHaveBeenCalledWith(vcSelfLink);
  });

  it('should call the print function when print button is clicked', () => {
    const { getByTestId } = render(
      <VcUtility
        document={AANZFTA_COO}
        onPrint={mockOnPrint}
        isPrintable={true}
      />
    );
    act(() => {
      getByTestId('print-button').click();
    });

    expect(mockOnPrint).toBeCalledTimes(1);
  });

  it('should provide a link to download the vc', () => {
    const modifiedVc = {
      ...AANZFTA_COO,
      credentialSubject: {
        ...AANZFTA_COO.credentialSubject,
        name: 'testName',
      },
    };
    const { getByTestId } = render(
      <VcUtility
        document={modifiedVc}
        onPrint={mockOnPrint}
        isPrintable={true}
      />
    );
    const downloadLink = getByTestId('download-link');
    expect(downloadLink.getAttribute('href')).toBe(
      `data:text/json;,${encodeURIComponent(
        JSON.stringify(modifiedVc, null, 2)
      )}`
    );
    expect(downloadLink.getAttribute('download')).toBe('testName.json');
  });

  it('should use the default file name if vc subject does not contain a name property', () => {
    const { getByTestId } = render(
      <VcUtility
        document={AANZFTA_COO}
        onPrint={mockOnPrint}
        isPrintable={true}
      />
    );
    expect(getByTestId('download-link').getAttribute('download')).toBe(
      'untitled.json'
    );
  });
});
