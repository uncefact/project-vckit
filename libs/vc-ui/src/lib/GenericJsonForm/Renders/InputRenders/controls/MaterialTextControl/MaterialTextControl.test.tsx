import { fireEvent } from '@testing-library/react';
import { MaterialTextControl } from './MatirialTextControl';
import {
  samplePropsInputFields,
  samplePropsInputFieldsRequired,
  jsonFormsTestHarness,
} from '../../../../testUtils';

describe('MaterialTextControl', () => {
  it('should render', () => {
    const mockCallback = jest.fn();
    const { queryAllByText } = jsonFormsTestHarness(
      '',
      <MaterialTextControl
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
      <MaterialTextControl
        handleChange={mockCallback}
        {...samplePropsInputFields}
      />
    );

    const field = getByLabelText('sample');
    fireEvent.change(field, { target: { value: 'google it' } });
    expect((field as HTMLInputElement).value).toBe('google it');
  });

  it('should show when required', async () => {
    const mockCallback = jest.fn();
    const { findByText, getByLabelText } = jsonFormsTestHarness(
      '',
      <MaterialTextControl
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
