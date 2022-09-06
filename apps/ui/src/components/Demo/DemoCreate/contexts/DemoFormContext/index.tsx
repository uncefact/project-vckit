import React, { createContext, ReactChildren, useState } from "react";
import { data } from "../../DemoCreateForm/data";
interface DemoFormContextProps {
  formValues: Record<string, any>;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

export const DemoFormContext = createContext<DemoFormContextProps>({
  formValues: data,
  setFormValues: () => null,
});

export const DemoFormProvider: any = ({ children }: { children: ReactChildren }) => {
  const [formValues, setFormValues] = useState({
    ...data,
    exporterDetails: {
      ...data.exporterDetails,
      exporterAddress: {
        ...data.exporterDetails.exporterAddress,
      },
    },
    importerDetails: {
      ...data.importerDetails,
      importerAddress: {
        ...data.importerDetails.importerAddress,
      },
    },
    descriptionOfGoods: {
      ...data.descriptionOfGoods,
    },
    firstSignatoryAuthentication: {
      ...data.firstSignatoryAuthentication,
    },
  });

  return <DemoFormContext.Provider value={{ formValues, setFormValues }}>{children}</DemoFormContext.Provider>;
};
