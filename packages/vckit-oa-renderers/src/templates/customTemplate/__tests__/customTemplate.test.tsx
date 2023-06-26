import { CustomTemplate } from "../customTemplate";
import { customTemplateCertificate } from "../../samples";
import { render } from "@testing-library/react";
import React from "react";

describe("customTemplate", () => {
  it("should render with title provided by the document", () => {
    const { queryByText } = render(
      <CustomTemplate document={customTemplateCertificate} handleObfuscation={() => void 0} />
    );
    // eslint-disable-next-line jest/no-truthy-falsy
    expect(queryByText("Bar is awesome")).toBeTruthy();
  });
  it("should render with default title", () => {
    const { queryByText } = render(
      <CustomTemplate document={{ ...customTemplateCertificate, foo: undefined }} handleObfuscation={() => void 0} />
    );
    // eslint-disable-next-line jest/no-truthy-falsy
    expect(queryByText("Default title")).toBeTruthy();
  });
});
