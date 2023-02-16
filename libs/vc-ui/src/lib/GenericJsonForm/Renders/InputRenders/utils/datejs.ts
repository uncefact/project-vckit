/**
 * Origin From
 * https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/util/datejs.tsx
 */
import dayjs from 'dayjs';
import customParsing from 'dayjs/plugin/customParseFormat';

// required for the custom save formats in the date, time and date-time pickers
dayjs.extend(customParsing);

export const createOnChangeHandler = (
  path: string,
  handleChange: (path: string, value: any) => void,
  saveFormat: string | undefined
) => (time: dayjs.Dayjs | null, textInputValue?: string) => {
  if (!time) {
    handleChange(path, undefined);
    return;
  }
  const result = dayjs(time).format(saveFormat);
  handleChange(path, result === 'Invalid Date' ? textInputValue : result);
};
