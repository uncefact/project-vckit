import ReactDOM from "react-dom";
import { customTemplateCertificate, svgTemplateCertificate } from "../src/templates/samples";
import React from "react";
import { App } from "./app";

ReactDOM.render(
  <App
    documents={[
      { name: "Default document", document: customTemplateCertificate },
      {
        name: "Red document",
        document: {
          ...customTemplateCertificate,
          foo: "bar",
          $template: {
            ...customTemplateCertificate.$template,
            name: "red"
          }
        }
      },
      { name: "SVG document", document: svgTemplateCertificate }
    ]}
  />,
  document.getElementById("root")
);
