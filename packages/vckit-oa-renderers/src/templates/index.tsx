import { TemplateRegistry } from "@govtechsg/decentralized-renderer-react-components";
import { templates as customTemplate } from "./customTemplate";
import { templates as svgTemplate } from "./svgRenderer";
import styled from "@emotion/styled";
import { CustomTemplate } from "./customTemplate/customTemplate";
import { CustomTemplateCertificate, SVGTemplateCertificate } from "./samples";

const svgRegistry: TemplateRegistry<SVGTemplateCertificate> = { svgTemplate: svgTemplate };
const customRegistry: TemplateRegistry<CustomTemplateCertificate> = {
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

export const registry = { ...svgRegistry, ...customRegistry };
