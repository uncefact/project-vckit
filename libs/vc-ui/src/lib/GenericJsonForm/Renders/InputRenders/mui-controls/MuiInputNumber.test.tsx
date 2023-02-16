import { fireEvent } from '@testing-library/react';
import { MuiInputNumber } from './MuiInputNumber';
import {
  samplePropsInputFields,
  jsonFormsTestHarness,
} from '../../../testUtils';

describe('MuiInputNumber', () => {
  it('should render', async () => {
    const mockCallback = jest.fn();
    const { findByTestId } = jsonFormsTestHarness(
      '',
      <MuiInputNumber handleChange={mockCallback} {...samplePropsInputFields} />
    );
    const title = await findByTestId('testNumberInput');
    expect(title).toBeInstanceOf(HTMLElement);
  });

  it('should take input', async () => {
    const mockCallback = jest.fn();
    const { findByTestId } = jsonFormsTestHarness(
      '',
      <MuiInputNumber handleChange={mockCallback} {...samplePropsInputFields} />
    );

    const field = await findByTestId('testNumberInput');
    fireEvent.change(field, { target: { value: 'google it' } });
    expect((field as HTMLInputElement).value).toBe('');
    fireEvent.change(field, { target: { value: '1234' } });
    expect((field as HTMLInputElement).value).toBe('1234');
  });
});
