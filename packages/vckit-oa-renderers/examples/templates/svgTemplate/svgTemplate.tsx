import React, { useState, useEffect } from "react";
import Handlebars from "handlebars";
import { PurchaseOrderSample } from "../samples/purchaseOrderSample";

function SvgTemplate({ document }: { document: PurchaseOrderSample }) {
  const [htmlString, setHtmlString] = useState<string>("");

  useEffect(() => {
    compileTemplateWithDocument();
  }, [document]);

  const compileTemplateWithDocument = () => {
    if (!document.svg || !document.svg.trim()) {
      setHtmlString("");
      return;
    }

    const compiledTemplate = Handlebars.compile(document.svg);
    setHtmlString(compiledTemplate(document));
  };

  return (
    <div id="svg-template">
      {htmlString !== "" ? (
        <div data-testid="svg-renderer-element" dangerouslySetInnerHTML={{ __html: htmlString }} />
      ) : (
        <div data-testid="json-renderer-element">Ok</div>
      )}
    </div>
  );
}

export default SvgTemplate;
