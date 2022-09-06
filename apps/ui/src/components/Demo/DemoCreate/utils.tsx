export const getFormValue = (formData: { [key: string]: any }, key: string): string => {
  let keys = key.split(".");
  while (keys.length > 1) {
    formData = formData[keys[0]];
    keys = keys.slice(1);
  }

  return formData[keys[0]];
};

export const isImageData = (value: string): boolean => {
  if (!value) {
    return false;
  }
  return value.slice(0, 10) === "data:image";
};
