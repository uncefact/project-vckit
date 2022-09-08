import _ from "lodash";
import React, { createContext, FunctionComponent, useContext, useState } from "react";
import { FormData, FormEntry, FormTemplate, Ownership, SetFormParams } from "../../../types";
import { useConfigContext } from "../config";

interface FormsContext {
  activeFormIndex?: number;
  forms: FormEntry[];
  currentForm?: FormEntry;
  currentFormData?: FormData;
  currentFormOwnership?: Ownership;
  currentFormTemplate?: FormTemplate;
  setActiveFormIndex: (index?: number) => void;
  setForms: (forms: FormEntry[]) => void;
  newForm: (templateIndex: number) => void;
  newPopulatedForm: (templateIndex: number, formData: Array<FormEntry>, fileName?: string) => void;
  setCurrentFormData: (formData: FormData) => void;
  setCurrentFormOwnership: (ownership: Ownership) => void;
  setCurrentFileName: (fileName: string) => void;
  setCurrentForm: (arg: SetFormParams) => void;
}

export const FormsContext = createContext<FormsContext>({
  forms: [],
  setActiveFormIndex: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setForms: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  newForm: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  newPopulatedForm: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setCurrentFormData: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setCurrentFormOwnership: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setCurrentFileName: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setCurrentForm: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useFormsContext = (): FormsContext => useContext<FormsContext>(FormsContext);

export const FormsContextProvider: FunctionComponent = ({ children }) => {
  const [activeFormIndex, setActiveFormIndex] = useState<number | undefined>(undefined);
  const [forms, setForms] = useState<FormEntry[]>([]);
  const { config } = useConfigContext();

  const currentForm = typeof activeFormIndex === "number" ? forms[activeFormIndex] : undefined;
  const currentFormData = currentForm?.data;
  const currentFormOwnership = currentForm?.ownership;
  const currentFormTemplate = currentForm ? config?.forms[currentForm?.templateIndex] : undefined;

  const newForm = (templateIndex: number): void => {
    const newIndex = forms.length;
    const newFormTemplate = config?.forms[templateIndex];
    const newFormName = newFormTemplate?.name ?? "Document";
    const extension = config?.forms[templateIndex]?.extension ?? "tt";

    setForms([
      ...forms,
      {
        templateIndex,
        data: {
          formData: newFormTemplate?.defaults || {},
          schema: newFormTemplate?.schema,
        },
        fileName: `${newFormName}-${forms.length + 1}`,
        ownership: { beneficiaryAddress: "", holderAddress: "" },
        extension: extension,
      },
    ]);

    setActiveFormIndex(newIndex);
  };

  const newPopulatedForm = (templateIndex: number, data: Array<FormEntry>, fileName?: string): void => {
    try {
      const newFormTemplate = config?.forms[templateIndex];
      const formEntries: FormEntry[] = [];
      const extension = config?.forms[templateIndex]?.extension ?? "tt";

      for (let index = 0; index < data.length; index++) {
        const newFormName = fileName
          ? _.template(fileName)(data[index])
          : `${newFormTemplate?.name.replace(/\s+/g, "-") ?? "Document"}-${forms.length + 1 + index}`;
        formEntries.push({
          templateIndex,
          data: {
            formData: data[index],
            schema: newFormTemplate?.schema,
          },
          fileName: newFormName,
          ownership: data[index].ownership ?? { beneficiaryAddress: "", holderAddress: "" },
          extension: extension,
        });
      }
      setForms([...forms, ...formEntries]);
      setActiveFormIndex(forms.length);
    } catch (e) {
      if (e instanceof ReferenceError) {
        throw new Error("failed to interpolate data properties, could not find data properties in configuration file.");
      }
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setCurrentFormData = (data: any): void => {
    if (activeFormIndex === undefined) throw new Error("Trying to set form when there is no activeFormIndex");
    setCurrentForm({ data });
  };

  const setCurrentFormOwnership = ({ beneficiaryAddress, holderAddress }: Ownership): void => {
    if (activeFormIndex === undefined) throw new Error("Trying to set form when there is no activeFormIndex");
    setCurrentForm({ data: undefined, updatedOwnership: { beneficiaryAddress, holderAddress } });
  };

  const setCurrentFileName = (fileName: string): void => {
    if (activeFormIndex === undefined) return;
    setCurrentForm({ data: undefined, updatedOwnership: undefined, fileName });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setCurrentForm = ({ data, updatedOwnership, fileName }: SetFormParams): void => {
    try {
      if (activeFormIndex === undefined) return;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const currentForm = forms[activeFormIndex];
      const nextForms = [...forms];
      const updatedCurrentForm = {
        ...currentForm,
        data: data ?? currentForm.data,
        ownership: updatedOwnership ?? currentForm.ownership,
        fileName: fileName ? _.template(fileName)(data?.formData) : currentForm.fileName.replace(/\s+/g, "-"),
      } as FormEntry;
      nextForms.splice(activeFormIndex, 1, updatedCurrentForm);
      setForms(nextForms);
    } catch (e) {
      if (e instanceof ReferenceError) {
        throw new Error("failed to interpolate data properties, could not find data properties in configuration file.");
      }
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  };

  return (
    <FormsContext.Provider
      value={{
        activeFormIndex,
        forms,
        currentForm,
        currentFormData,
        currentFormOwnership,
        currentFormTemplate,
        setCurrentFormData,
        setCurrentFormOwnership,
        newForm,
        newPopulatedForm,
        setActiveFormIndex,
        setForms,
        setCurrentFileName,
        setCurrentForm,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};
