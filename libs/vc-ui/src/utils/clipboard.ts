export const copyToClipboard = async (data: string) => {
  try {
    await navigator.clipboard.writeText(data);
  } catch (err) {
    throw new Error('Failed to copy data to the clipboard');
  }
};
