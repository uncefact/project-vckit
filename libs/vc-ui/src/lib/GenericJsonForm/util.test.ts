import { Translator, UISchemaElement } from '@jsonforms/core';
import { ErrorObject } from 'ajv';
import { JsonFormsErrorMapper } from './util';

const error: ErrorObject = {
  keyword: 'required',
  instancePath: '#/path',
  schemaPath: '#/path',
  params: {},
};
const nonRequiredError: ErrorObject = {
  keyword: 'minLength',
  instancePath: '#/path',
  schemaPath: '#/path',
  message: 'must be of length',
  params: {},
};

const translatorObj: Translator = () => '';

const uischema: UISchemaElement & { label?: string } = {
  type: '',
  label: 'boppo',
};

describe('genericJsonForm Utils', () => {
  it('should show adjusted error message', () => {
    const response = JsonFormsErrorMapper(error, translatorObj, uischema);

    expect(response).toEqual('boppo is a required field');
  });
  it("should return default message if error message isn't overridden", () => {
    const response = JsonFormsErrorMapper(
      nonRequiredError,
      translatorObj,
      uischema
    );

    expect(response).toEqual('must be of length');
  });
});
