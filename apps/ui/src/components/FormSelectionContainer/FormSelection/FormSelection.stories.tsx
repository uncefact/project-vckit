import React, { FunctionComponent } from "react";
import { Config } from "../../../types/";
import { FormSelection } from "./FormSelection";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "DynamicForm/FormSelection",
  component: FormSelection,
  parameters: {
    componentSubtitle: "FormSelection.",
  },
};

export const Default: FunctionComponent = () => (
  <MemoryRouter>
    <FormSelection
      config={
        {
          wallet: { address: "0x1234...5678" },
          forms: [
            {
              name: "Bill of Lading",
              type: "TRANSFERABLE_RECORD",
            },
            {
              name: "Purchase Order",
              type: "VERIFIABLE_DOCUMENT",
            },
          ],
        } as Config
      }
    />
  </MemoryRouter>
);
