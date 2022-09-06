import { PDFDocument } from "pdf-lib";
import { augmentPDF } from "./augmentPDF";

const embedPngWidth = 600;
const pdfWidth = 500;
const scaledPngWidth = 80;
const scaledPngHeight = 80;

const document = "testDocument";
const qrCode = "testQrCode";
const watermark = {
  qrCode: {
    x: 1,
    y: 2,
    size: 0.2,
  },
};

const getWidthValue = 500;
const getHeighValue = 900;

const { x, y, size } = watermark.qrCode;

const drawImageObject = {
  x: x * getWidthValue,
  y: y * getHeighValue,
  width: scaledPngWidth,
  height: scaledPngHeight,
};

const mockSave = jest.fn();
const mockGetHeight = jest.fn();
const mockGetWidth = jest.fn();
const mockDrawImage = jest.fn();

const mockScale = jest.fn(() => ({
  width: scaledPngWidth,
  height: scaledPngHeight,
}));

const mockGetPage = jest.fn(() => ({
  getWidth: mockGetWidth,
  getHeight: mockGetHeight,
  drawImage: mockDrawImage,
}));

const mockEmbedPng = jest.fn(() => ({
  width: embedPngWidth,
  scale: mockScale,
}));

jest.mock("pdf-lib", () => ({
  PDFDocument: {
    load: jest.fn(() => ({
      embedPng: mockEmbedPng,
      getPage: mockGetPage,
      save: mockSave,
    })),
  },
}));

describe("augmentPDF", () => {
  it("should embed a pdf with the provided qrcode", async () => {
    mockSave.mockResolvedValueOnce("savedPdf");
    mockGetWidth.mockReturnValue(pdfWidth);
    mockGetHeight.mockReturnValueOnce(900);

    const pdfWithEmbededQrCode = await augmentPDF(document, qrCode, watermark);

    expect(PDFDocument.load).toBeCalledWith(document);
    expect(mockEmbedPng).toBeCalledWith(qrCode);
    expect(mockGetPage).toBeCalledWith(0);
    expect(mockScale).toHaveBeenCalledWith((size * pdfWidth) / embedPngWidth);
    expect(mockDrawImage).toBeCalledWith(mockEmbedPng(), drawImageObject);
    expect(pdfWithEmbededQrCode).toBe("savedPdf");
  });

  it("should throw error if it fails to augment the pdf", async () => {
    mockDrawImage.mockImplementationOnce(() => {
      throw new Error("TestError");
    });

    await expect(augmentPDF(document, qrCode, watermark)).rejects.toThrow();
  });
});
