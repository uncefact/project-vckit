import { createOnChangeHandler } from './datejs';
import dayjs from 'dayjs';

describe('datejs', () => {
  it('should return data with correct format', () => {
    const mockCallback = jest.fn();
    const onDateChange = createOnChangeHandler(
      '#/values',
      mockCallback,
      'YYYY-MM-DD HH:mm'
    );
    onDateChange(dayjs('2022-12-12 12:12'), '2022-12-12 12:12');

    expect(mockCallback).toBeCalledWith('#/values', '2022-12-12 12:12');
  });
  it('should return undefined if change value is null', () => {
    const mockCallback = jest.fn();
    const onDateChange = createOnChangeHandler(
      '#/values',
      mockCallback,
      'YYYY-MM-DD HH:mm'
    );
    onDateChange(null);

    expect(mockCallback).toBeCalledWith('#/values', undefined);
  });
});
