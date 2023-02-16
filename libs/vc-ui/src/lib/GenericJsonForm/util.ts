import { Translator, UISchemaElement } from "@jsonforms/core";
import { ErrorObject } from "ajv";

  export const JsonFormsErrorMapper = (
    error: ErrorObject,
    _translate: Translator,
    uischema?: UISchemaElement & { label?: string }
  ): string => {
    const fieldLabel: string = uischema?.label
      ? uischema.label
      : (error.params['missingProperty'] as string);
    switch (error.keyword) {
      case 'required':
        return `${fieldLabel} is a required field`;
    }
    return error.message ? error.message : '';
  };
