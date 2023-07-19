import { CSSProperties, useCallback, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { XYCoord } from 'react-dnd';
import { QRCode } from '../QrCode/QrCode.js';

const styles: { [key: string]: CSSProperties } = {
  renderContainer: {
    margin: 'auto',
    border: '1px solid black',
    position: 'relative',
  },
  qrCode: {
    position: 'absolute',
    padding: '0.5rem 1rem',
    cursor: 'move',
  },
};

interface DragItem {
  left: number;
  top: number;
}

const ItemTypes = {
  QRCODE: 'QRCode',
};

export interface QrCodeDocumentContainerProps {
  qrCodeValue: string;
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

export function QrCodeDocumentContainer({
  qrCodeValue,
  width,
  height,
  children,
}: QrCodeDocumentContainerProps) {
  width = width || '595px';
  height = height || '842px';

  const [qrcode, setQrcode] = useState<{
    top: number;
    left: number;
  }>({ top: 20, left: 80 });

  const moveQRCode = useCallback(
    (left: number, top: number) => {
      setQrcode((qrcode) => {
        return { ...qrcode, left, top };
      });
    },
    [setQrcode]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.QRCODE,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveQRCode(left, top);
        return undefined;
      },
    }),
    [setQrcode]
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.QRCODE,
      item: { left: qrcode.left, top: qrcode.top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [qrcode.left, qrcode.top]
  );

  const drapableQRCode = () => {
    if (!isDragging && qrCodeValue) {
      return (
        <div
          ref={drag}
          style={{ ...styles.qrCode, left: qrcode.left, top: qrcode.top }}
        >
          <QRCode value={qrCodeValue} />
        </div>
      );
    }
  };

  return (
    <div style={{ ...styles.renderContainer, width, height }} ref={drop}>
      {drapableQRCode()}

      {children}
    </div>
  );
}
