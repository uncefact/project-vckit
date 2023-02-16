import { getByTestId, render } from '@testing-library/react';
import { QrCode } from './QrCode';

describe('QRCode', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QrCode url={'test'} />);
    expect(baseElement).toBeTruthy();
  });

  it('should use the size specified', () => {
    const { baseElement } = render(
      <QrCode url={'test'} qrCodeOptions={{ width: 300 }} />
    );
    const qrcodeElement = getByTestId(baseElement, 'qrcode');

    expect(qrcodeElement.getAttribute('width')).toBe('300');
    expect(qrcodeElement.getAttribute('height')).toBe('300');
  });
});
