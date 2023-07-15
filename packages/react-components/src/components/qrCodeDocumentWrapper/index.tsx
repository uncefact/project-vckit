import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import {
  QrCodeDocumentContainer,
  QrCodeDocumentContainerProps,
} from './qrCodeDocumentContainer';

export function QrCodeDocumentWrapper({
  qrCodeValue,
  children,
}: QrCodeDocumentContainerProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <QrCodeDocumentContainer qrCodeValue={qrCodeValue}>
        {children}
      </QrCodeDocumentContainer>
    </DndProvider>
  );
}
