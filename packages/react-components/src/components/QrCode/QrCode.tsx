import { useEffect, useRef } from 'react';
import * as QrCode from 'qrcode';

interface QRCodeProps {
  value: string;
  qrCodeOptions?: QrCode.QRCodeRenderersOptions;
}

export function QRCode({ value, qrCodeOptions = { width: 200 } }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (value) {
      QrCode.toCanvas(
        canvasRef.current,
        value,
        { ...qrCodeOptions },
        function (error) {
          if (error) {
            throw new Error('Error generating the QRCode');
          }
        }
      );
    }
  }, [value, qrCodeOptions]);

  return <canvas ref={canvasRef}></canvas>;
}
