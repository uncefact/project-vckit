import { fireEvent } from '@testing-library/react';
import { MaterialNumberControl } from './MaterialNumberControl';
import {
  samplePropsInputFields,
  samplePropsInputFieldsRequired,
  jsonFormsTestHarness,
} from '../../../../testUtils';

describe('MaterialNumberControl', () => {
  it('should render', () => {
    const mockCallback = jest.fn();
    const { queryAllByText } = jsonFormsTestHarness(
      '',
      <MaterialNumberControl
        handleChange={mockCallback}
        {...samplePropsInputFields}
      />
    );
    const title = queryAllByText(samplePropsInputFields.label)[0];
    expect(title).toBeInstanceOf(HTMLElement);
  });

  it('should take input', () => {
    const mockCallback = jest.fn();
    const { getByLabelText } = jsonFormsTestHarness(
      '',
      <MaterialNumberControl
        handleChange={mockCallback}
        {...samplePropsInputFields}
      />
    );

    const field = getByLabelText('sample');
    fireEvent.change(field, { target: { value: 'google it' } });
    expect((field as HTMLInputElement).value).toBe('');
    fireEvent.change(field, { target: { value: '1234' } });
    expect((field as HTMLInputElement).value).toBe('1234');
  });

  it('should show when required', async () => {
    const mockCallback = jest.fn();
    const { findByText, getByLabelText } = jsonFormsTestHarness(
      '',
      <MaterialNumberControl
        handleChange={mockCallback}
        {...samplePropsInputFieldsRequired}
      />,
      true
    );

    const field = getByLabelText('sample *');
    expect(field).toBeInstanceOf(HTMLElement);

    const required = await findByText('required');
    expect(required).toBeInstanceOf(HTMLElement);
  });
});
