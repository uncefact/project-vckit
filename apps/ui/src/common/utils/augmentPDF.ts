import { PDFDocument } from "pdf-lib";
import { Watermark } from "../../types";

type AugmentPDF = (
  document: string | Uint8Array | ArrayBuffer,
  qrCode: string | Uint8Array | ArrayBuffer,
  watermark: Watermark
) => Promise<Uint8Array | undefined>;

export const augmentPDF: AugmentPDF = async (document, qrCode, watermark) => {
  try {
    const pdfDoc = await PDFDocument.load(document);
    const pngImage = await pdfDoc.embedPng(qrCode);
    const pageToEmbedQR = pdfDoc.getPage(0);

    const imageWidth = pngImage.width;
    const targetWidth = watermark.qrCode.size * pageToEmbedQR.getWidth();

    const imageScale = targetWidth / imageWidth;
    const pngDims = pngImage.scale(imageScale);

    const scaledXAxis = watermark.qrCode.x * pageToEmbedQR.getWidth();
    const scaledYAxis = watermark.qrCode.y * pageToEmbedQR.getHeight();

    pageToEmbedQR.drawImage(pngImage, {
      x: scaledXAxis,
      y: scaledYAxis,
      width: pngDims.width,
      height: pngDims.height,
    });

    return pdfDoc.save();
  } catch (err) {
    throw new Error("Error embedding the QRCode into the PDF");
  }
};
