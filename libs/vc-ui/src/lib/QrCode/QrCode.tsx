import * as QRCode from 'qrcode';
import { MouseEventHandler, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { Box } from '@mui/material';

interface IQrCode {
  url: string;
  qrCodeOptions?: QRCode.QRCodeRenderersOptions;
  onResize?: (
    newQrWidth: number,
    elementMovementX: number,
    elementMovementY: number
  ) => void;
  isResizable?: boolean;
}

export const QrCode = ({
  url,
  qrCodeOptions = { width: 200 },
  onResize,
  isResizable = false,
}: IQrCode) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  let xPosition = 0;
  let qrWidth = 0;

  const mouseDownHandler: MouseEventHandler<HTMLDivElement> = function (e) {
    if (containerRef.current) {
      xPosition = e.clientX;
      qrWidth = containerRef.current.clientWidth;

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  };

  const mouseMoveHandler = function (e: MouseEvent) {
    const movementX = e.movementX;
    const movementY = e.movementY;
    const resizeChangeInPosition = e.clientX - xPosition;
    const newQrCodeWidth = qrWidth + resizeChangeInPosition;

    if (onResize && newQrCodeWidth >= 80) {
      throttle(() => {
        onResize(newQrCodeWidth, movementX, movementY);
      }, 300)();
    }
    e.stopPropagation();
  };

  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        ...qrCodeOptions,
      }).catch(() => {
        throw new Error('Error generating the QRCode');
      });
    }
  }, [url, qrCodeOptions]);

  return (
    <Box ref={containerRef} sx={{}}>
      <canvas
        tabIndex={0}
        aria-label="QRCode that contains the Verifiable Credentials Uniform Resource Identifier"
        ref={canvasRef}
        data-testid={'qrcode'}
        style={{ marginBottom: '-5px' }}
      ></canvas>
      {isResizable && (
        <Box
          sx={{
            position: 'absolute',
            cursor: 'nwse-resize',
            width: '10px',
            height: '10px',
            zIndex: 2,
            right: 0,
            bottom: 0,
          }}
          data-testid={'qrcode-resize'}
          onMouseDown={mouseDownHandler}
        />
      )}
    </Box>
  );
};
