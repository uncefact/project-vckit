import { act, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenericJsonForm } from './GenericJsonForm';
import { jsonFormsTestHarness } from './testUtils';

const testSchema = {
  type: 'object',
  properties: {
    testInput: {
      type: 'string',
      title: 'test input',
    },
  },
};

const testSchemaRequired = {
  type: 'object',
  properties: {
    testInput: {
      type: 'string',
      title: 'test input',
    },
    testInputRequired: {
      type: 'string',
      title: 'Required test input',
    },
  },
  required: ['testInputRequired'],
};

const testSchemaNestedRequired = {
  type: 'object',
  properties: {
    testInput: {
      type: 'string',
      title: 'test input',
    },
    testNestedRequired: {
      type: 'object',
      properties: {
        testRequired: {
          type: 'string',
          title: 'Required test input',
        },
      },
      required: ['testRequired'],
    },
  },
  required: ['testNestedRequired'],
};
const testSchemaMaxLength = {
  type: 'object',
  properties: {
    testInput: {
      type: 'string',
      title: 'test input',
      maxLength: 5,
    },
  },
};

describe('genericJsonForm', () => {
  it('should show title', () => {
    const { getByText } = jsonFormsTestHarness(
      '',
      <GenericJsonForm
        schema={testSchema}
        onSubmit={() => jest.fn()}
        title={'Test Example'}
        submitting={false}
      />
    );
    getByText('Test Example');
  });
  it('should show error message', () => {
    const { getByText } = jsonFormsTestHarness(
      '',
      <GenericJsonForm
        schema={testSchema}
        onSubmit={() => jest.fn()}
        title={'Test Example'}
        submitting={false}
        submissionError={'failed to submit'}
      />
    );
    getByText('failed to submit');
  });

  it('should show all fields in form', () => {
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <GenericJsonForm
        schema={testSchema}
        onSubmit={() => jest.fn()}
        title={'Test Example'}
        submitting={false}
        submissionError={'failed to submit'}
      />
    );
    getByTestId('test-input:test input');
  });

  it('should update form value when field is changed', async () => {
    const mockCB = jest.fn();
    const { getByTestId } = jsonFormsTestHarness(
      {},
      <GenericJsonForm
        schema={testSchema}
        onSubmit={mockCB}
        title={'Test Example'}
        submitting={false}
      />
    );
    const input = getByTestId('test-input:test input');
    expect(input).toBeInstanceOf(HTMLInputElement);
    await userEvent.click(input);
    await userEvent.type(input, 'abcd');

    const submitButton = getByTestId('button:Submit');

    //Json forms can take a hot sec to propagate
    //So waiting for the on change to update the state of the submit button
    await waitFor(() => {
      expect(submitButton.getAttribute('disabled')).toBe(null);
    });
    fireEvent.click(submitButton);
    expect(mockCB).toBeCalledWith({
      testInput: 'abcd',
    });
  });

  it('should stop submit if there are required fields without value', async () => {
    const mockCB = jest.fn();
    const { getByTestId } = jsonFormsTestHarness(
      {
        testInput: 'abcd',
      },
      <GenericJsonForm
        schema={testSchemaRequired}
        onSubmit={mockCB}
        title={'Test Example'}
        submitting={false}
      />
    );

    const input = getByTestId('test-input:test input');
    expect(input).toBeInstanceOf(HTMLInputElement);
    await userEvent.click(input);
    await userEvent.type(input, 'abcd');

    //Wait for json forms to propagate
    await new Promise((r) => setTimeout(r, 500));

    const submitButton = getByTestId('button:Submit');
    expect(submitButton.getAttribute('disabled')).toEqual('');

    const input2 = getByTestId('test-input:Required test input');
    expect(input2).toBeInstanceOf(HTMLInputElement);
    await userEvent.click(input2);
    await userEvent.type(input2, 'abcd');
    //Json forms can take a hot sec to propagate
    //So waiting for the on change to update the state of the submit button
    await waitFor(() => {
      expect(submitButton.getAttribute('disabled')).toBe(null);
    });
    fireEvent.click(submitButton);
    expect(mockCB).toBeCalledWith({
      testInputRequired: 'abcd',
      testInput: 'abcd',
    });
  });
  it('should stop submit if theres nested required fields without a value', async () => {
    const mockCB = jest.fn();
    const { getByTestId } = jsonFormsTestHarness(
      {
        testInput: 'abcd',
      },
      <GenericJsonForm
        schema={testSchemaNestedRequired}
        onSubmit={mockCB}
        title={'Test Example'}
        submitting={false}
      />
    );
    const input = getByTestId('test-input:test input');
    await act(async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'abcd');
    });

    //Wait for json forms to propagate
    await new Promise((r) => setTimeout(r, 500));
    const submitButton = getByTestId('button:Submit');
    expect(submitButton.getAttribute('disabled')).toEqual('');

    const input2 = getByTestId('test-input:Required test input');
    await act(async () => {
      expect(input2).toBeInstanceOf(HTMLInputElement);
      await userEvent.click(input2);
      await userEvent.type(input2, 'abcd');
    });
    //Json forms can take a hot sec to propagate
    //So waiting for the on change to update the state of the submit button
    await waitFor(() => {
      expect(submitButton.getAttribute('disabled')).toBe(null);
    });
    fireEvent.click(submitButton);
    expect(mockCB).toBeCalledWith({
      testInput: 'abcd',
      testNestedRequired: {
        testRequired: 'abcd',
      },
    });
  });

  it('should show error when exceeding max length', async () => {
    const mockCB = jest.fn();
    const { getByTestId, findByText } = jsonFormsTestHarness(
      {
        testInput: 'abcd',
      },
      <GenericJsonForm
        schema={testSchemaMaxLength}
        onSubmit={mockCB}
        title={'Test Example'}
        submitting={false}
      />
    );
    const input = getByTestId('test-input:test input');

    await act(async () => {
      expect(input).toBeInstanceOf(HTMLInputElement);
      await userEvent.click(input);
      await userEvent.type(input, 'abcdefghi');
    });

    //Wait for json forms to propagate
    await new Promise((r) => setTimeout(r, 500));
    const errorMessage = await findByText(
      'must NOT have more than 5 characters'
    );
    expect(errorMessage).toBeTruthy();
  });
});
