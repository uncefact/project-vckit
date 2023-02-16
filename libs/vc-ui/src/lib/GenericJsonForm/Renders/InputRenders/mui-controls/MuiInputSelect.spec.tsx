import { fireEvent } from '@testing-library/react';
import { MuiSelect } from './MuiInputSelect';
import {
  samplePropsInputFields,
  jsonFormsTestHarness,
} from '../../../testUtils';

const mockCallback = jest.fn();

const options = [
  {
    label: 'test1',
    value: 'test1',
  },
  {
    label: 'test2',
    value: 'test2',
  },
];

const sampleProps = {
  ...samplePropsInputFields,
  schema: { type: 'string', enum: options },
  options,
};

describe('MuiInputSelect', () => {
  beforeEach(() => jest.clearAllMocks);

  it('should render', async () => {
    const { findByTestId } = jsonFormsTestHarness(
      '',
      <MuiSelect handleChange={mockCallback} {...sampleProps} />
    );
    const selectComponent = await findByTestId('select_input');
    expect(selectComponent).toBeInstanceOf(HTMLElement);
  });

  it('should have options', () => {
    const { getByRole, getByText } = jsonFormsTestHarness(
      '',
      <MuiSelect handleChange={mockCallback} {...sampleProps} />
    );

    const selectDropdownButton = getByRole('button');

    fireEvent.mouseDown(selectDropdownButton);
    expect(getByText(options[0].label)).toBeTruthy();
    expect(getByText(options[1].label)).toBeTruthy();
  });
});
