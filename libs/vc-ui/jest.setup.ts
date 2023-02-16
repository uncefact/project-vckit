import 'jest-canvas-mock';

const mockClipboard = {
  writeText: jest.fn(),
};

(global.navigator.clipboard as any) = mockClipboard;
