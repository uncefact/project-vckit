import { TemplateRegistry } from "@govtechsg/decentralized-renderer-react-components";
import { templates as customTemplate } from "./customTemplate";
import styled from "@emotion/styled";
import { CustomTemplate } from "./customTemplate/customTemplate";
import { CustomTemplateCertificate } from "./samples";

export const registry: TemplateRegistry<CustomTemplateCertificate> = {
  custom: customTemplate,
  red: [
    {
      id: "custom-red",
      label: "Red Custom Template",
      template: styled(CustomTemplate)`
        color: red;
      `
    }
  ]
};
