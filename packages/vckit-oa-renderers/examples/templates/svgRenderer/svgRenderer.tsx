import React, { useState, useEffect } from "react";
import Handlebars from "handlebars";
import { SVGTemplateCertificate } from "../samples/svgTemplateSample";
import purchaseOrderForm from "./templates/purchaseOrderForm.svg";

const templates: { [key: string]: any } = {
  purchaseOrderForm
};

function SVGRenderer({ document }: { document: SVGTemplateCertificate }) {
  const [htmlString, setHtmlString] = useState<string | null>(null);
  const [templatePath, setTemplatePath] = useState<string | null>(null);

  useEffect(() => {
    fetchHtmlString();
  }, [document]);

  const fetchHtmlString = () => {
    const path = document.svgTemplate ? templates[document.svgTemplate] : document.svgTemplateFile;

    if (path) {
      setTemplatePath(path);

      fetch(path)
        .then(r => r.text())
        .then(text => {
          const template = Handlebars.compile(text);
          setHtmlString(template(document));
        })
        .catch(() => {
          setTemplatePath(null);
        });
    } else {
      setTemplatePath(null);
    }
  };

  return (
    <div id="svg-template">
      {templatePath ? (
        htmlString ? (
          <div data-testid="svg-renderer-element" dangerouslySetInnerHTML={{ __html: htmlString }} />
        ) : (
          <div>Loading...</div>
        )
      ) : (
        <pre data-testid="json-renderer-element">{JSON.stringify(document, null, 2)}</pre>
      )}
    </div>
  );
}

export default SVGRenderer;
