export interface FileData {
  dataURL: string;
  name: string;
  size: number;
  type: string;
}

export const fileToBase64 = async (
  file: File
): Promise<FileData | DOMException> => {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = () => {
      reject(reader.error ?? '');
    };

    reader.onload = (event) => {
      resolve({
        dataURL: event?.target?.result,
        name,
        size,
        type,
      } as FileData);
    };
    reader.readAsDataURL(file);
  });
};
