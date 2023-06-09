import ReactDOM from "react-dom";
import { customTemplateCertificate, purchaseOrderSample } from "../src/templates/samples";
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
      { name: "SVG document", document: purchaseOrderSample }
    ]}
  />,
  document.getElementById("root")
);
