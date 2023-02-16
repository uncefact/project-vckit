import { fireEvent } from '@testing-library/react';
import { MaterialEnumControl } from './MaterialEnumControl';
import {
  samplePropsInputFields,
  jsonFormsTestHarness,
} from '../../../../testUtils';

const mockCallback = jest.fn();

const options = [
  {
    label: 'test1Label',
    value: 'test1Value',
  },
  {
    label: 'test2Label',
    value: 'test2Value',
  },
];

const sampleProps = {
  ...samplePropsInputFields,
  schema: { type: 'string', enum: options },
  options,
};

describe('MaterialEnumControl', () => {
  beforeEach(() => jest.clearAllMocks);

  it('should render', () => {
    const { queryAllByText } = jsonFormsTestHarness(
      '',
      <MaterialEnumControl handleChange={mockCallback} {...sampleProps} />
    );
    const title = queryAllByText(sampleProps.label)[0];
    expect(title).toBeInstanceOf(HTMLElement);
  });

  it('should have options', () => {
    const { getByRole, getByText } = jsonFormsTestHarness(
      '',
      <MaterialEnumControl handleChange={mockCallback} {...sampleProps} />
    );
    const selectDropdownButton = getByRole('button');

    fireEvent.mouseDown(selectDropdownButton);
    expect(getByText(options[0].label)).toBeTruthy();
    expect(getByText(options[1].label)).toBeTruthy();
  });

  it('should call the callback function when option is selected', () => {
    const { getByRole, getByText } = jsonFormsTestHarness(
      '',
      <MaterialEnumControl handleChange={mockCallback} {...sampleProps} />
    );
    const selectDropdownButton = getByRole('button');

    fireEvent.mouseDown(selectDropdownButton);
    fireEvent.click(getByText(options[0].label));

    expect(mockCallback).toHaveBeenCalledWith(
      sampleProps.path,
      options[0].value
    );
  });
});
