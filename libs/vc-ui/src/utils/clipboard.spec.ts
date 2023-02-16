import { copyToClipboard } from './clipboard';

// eslint-disable-next-line @typescript-eslint/unbound-method
const mockedClipboardWrite = navigator.clipboard.writeText as jest.Mock;

describe('Utils', () => {
  describe('CopyToClipboard', () => {
    it('should write to the clipboard', async () => {
      await copyToClipboard('testData');
      expect(mockedClipboardWrite).toBeCalledWith('testData');
    });

    it('should return clipboard error message when error occurs', async () => {
      mockedClipboardWrite.mockRejectedValueOnce(new Error());

      await expect(copyToClipboard('testData')).rejects.toThrow(
        'Failed to copy data to the clipboard'
      );
    });
  });
});
