import { ErrorObject } from "ajv";
import React, { FunctionComponent } from "react";
import { XCircle } from "react-feather";

export type FormError = ErrorObject[] | null | undefined;

interface FormErrorBanner {
  formErrorTitle: string | null | undefined;
  formError: FormError;
}
export const FormErrorBanner: FunctionComponent<FormErrorBanner> = ({ formErrorTitle, formError }) => {
  if (!formError || !(formError.length > 0)) return null;

  return (
    <div data-testid="form-error-banner" className="bg-red-100 rounded-lg mx-auto flex items-center p-6 mt-4">
      <XCircle className="text-rose mx-3 my-1 h-10 w-10" />
      <div className="text-rose font-bold flex flex-col justify-center items-left ml-4">
        <div>{formErrorTitle}</div>
        <ul className="list-disc pl-5">
          {formError &&
            formError.map((error, index: number) => {
              return (
                <li key={index}>
                  {error.instancePath} {error.message}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
