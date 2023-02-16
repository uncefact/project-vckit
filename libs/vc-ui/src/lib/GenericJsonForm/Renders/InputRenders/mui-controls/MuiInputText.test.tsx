import { fireEvent } from '@testing-library/react';
import { MuiInputText } from './MuiInputText';
import {
  samplePropsInputFields,
  jsonFormsTestHarness,
  samplePropsInputFieldsRestrictedLength,
} from '../../../testUtils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('MaterialInputControl', () => {
  it('should render', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <MuiInputText handleChange={mockCallback} {...samplePropsInputFields} />
    );
    getByTestId('test-input:sample');
  });

  it('should take input', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <MuiInputText handleChange={mockCallback} {...samplePropsInputFields} />
    );

    const field = getByTestId('test-input:sample');
    fireEvent.change(field, { target: { value: 'google it' } });
    expect((field as HTMLInputElement).value).toBe('google it');
  });
  it('should clear input on clear button press', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <MuiInputText handleChange={mockCallback} {...samplePropsInputFields} />
    );

    const field = getByTestId('test-input:sample');
    fireEvent.change(field, { target: { value: 'google it' } });
    expect((field as HTMLInputElement).value).toBe('google it');

    const clearButton = getByTestId('clearFieldButton');
    fireEvent.click(clearButton);

    expect((field as HTMLInputElement).value).toBe('');
  });
  it('should restrict input if specified', async () => {
    const mockCallback = jest.fn();
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <MuiInputText
        handleChange={mockCallback}
        {...samplePropsInputFieldsRestrictedLength}
      />,
      true
    );

    const field = getByTestId('test-input:sample');
    await userEvent.type(field, 'abcdefghi');
    expect((field as HTMLInputElement).value).toBe('abcde');
  });

  it('should hide clear button on unhover', async () => {
    const mockCallback = jest.fn();
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <MuiInputText
        handleChange={mockCallback}
        {...samplePropsInputFieldsRestrictedLength}
      />,
      true
    );

    const field = getByTestId('test-input:sample');
    const clearButton = getByTestId('clearFieldButton');

    await userEvent.hover(field);

    expect(clearButton).toBeVisible();
    await userEvent.unhover(field);
    expect(clearButton).not.toBeVisible();
  });
});
