import SVGRenderer from "../svgRenderer";
import { svgTemplateCertificate } from "../../samples";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

fetch = jest.fn(() =>
  Promise.resolve({
    text: () =>
      Promise.resolve(`
    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!-- Created with Inkscape (http://www.inkscape.org/) -->

    <svg
      version="1.1"
      id="svg640"
      width="808"
      height="544"
      viewBox="0 0 808 544"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
    >
      <defs id="defs644" />
      <g id="g646">
        <text xml:space="preserve" style="fill:#eff2ff" x="118.2666" y="479.41147" id="text704-748-4-54">
          <tspan id="tspan702-58-8-2" x="118.2666" y="479.41147" style="fill:#000000">{{buyer.location.address.name}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="117.41801" y="518.44672" id="text704-748-4-1">
          <tspan id="tspan702-58-8-9" x="117.41801" y="518.44672" style="fill:#000000">{{purchaseOrderNo}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="484.85818" y="478.5629" id="text704-748-4-2">
          <tspan id="tspan702-58-8-4" x="484.85818" y="478.5629" style="fill:#000000">{{approverName}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="484.85818" y="519.29529" id="text704-748-4-58">
          <tspan id="tspan702-58-8-6" x="484.85818" y="519.29529" style="fill:#000000">{{approverSignature}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="557.8371" y="239.26004" id="text704-18">
          <tspan id="tspan702-83" x="557.8371" y="239.26004" style="fill:#000000">{{orderDate}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="21.527153" y="288.47836" id="text704-52">
          <tspan id="tspan702-2" x="21.527153" y="288.47836" style="fill:#000000">{{items.0.itemCount}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="20.678566" y="307.996" id="text704-6">
          <tspan id="tspan702-6" x="20.678566" y="307.996" style="fill:#000000">{{items.1.itemCount}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="557.8371" y="193.4361" id="text704-55">
          <tspan id="tspan702-4" x="557.8371" y="193.4361" style="fill:#000000">{{otherBannerFoap}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="557.8371" y="170.52411" id="text704-1">
          <tspan id="tspan702-7" x="557.8371" y="170.52411" style="fill:#000000">{{bannerFoap}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="144.26057" y="169.67554" id="text704-8">
          <tspan id="tspan702-8" x="144.26057" y="169.67554" style="fill:#000000">{{buyer.location.address.streetAddress}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="144.26057" y="194.28468" id="text704-3">
          <tspan id="tspan702-81" x="144.26057" y="194.28468" style="fill:#000000">{{buyer.location.address.addressLocality}}, {{buyer.location.address.addressRegion}}, {{buyer.location.address.addressCountry}}, {{buyer.location.address.postalCode}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="143.72435" y="218.04526" id="text704-5">
          <tspan id="tspan702-3" x="143.72435" y="218.04526" style="fill:#000000">{{phoneNumber}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="557.83704" y="80.573402" id="text704-59">
          <tspan id="tspan702-5" x="557.83704" y="80.573402" style="fill:#000000">{{requestNumber}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="557.83704" y="146.76355" id="text704-4">
          <tspan id="tspan702-9" x="557.83704" y="146.76355" style="fill:#000000">{{orderDate}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="144.57295" y="240.95723" id="text704-54">
          <tspan id="tspan702-36" x="144.57295" y="240.95723" style="fill:#000000">{{email}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="144.26057" y="147.65495" id="text704">
          <tspan id="tspan702" x="144.26057" y="147.65495" style="fill:#000000">{{vendorName}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="703.79486" y="443.77063" id="text704-748-4-5">
          <tspan id="tspan702-58-8-5" x="703.79486" y="443.77063" style="fill:#000000">{{totalOrderAmount.price}} {{totalOrderAmount.priceCurrency}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="20.618254" y="327.08926" id="text704-52-0">
          <tspan id="tspan702-2-1" x="20.618254" y="327.08926" style="fill:#000000">{{items.2.itemCount}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="19.769667" y="346.6069" id="text704-6-9">
          <tspan id="tspan702-6-5" x="19.769667" y="346.6069" style="fill:#000000">{{items.3.itemCount}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="20.618254" y="366.97305" id="text704-52-7">
          <tspan id="tspan702-2-6" x="20.618254" y="366.97305" style="fill:#000000">{{items.4.itemCount}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="19.769667" y="386.49069" id="text704-6-8">
          <tspan id="tspan702-6-54" x="19.769667" y="386.49069" style="fill:#000000">{{items.5.itemCount}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="20.618254" y="406.00827" id="text704-52-79">
          <tspan id="tspan702-2-66" x="20.618254" y="406.00827" style="fill:#000000">{{items.6.itemCount}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="19.769667" y="425.52591" id="text704-6-6">
          <tspan id="tspan702-6-6" x="19.769667" y="425.52591" style="fill:#000000">{{items.7.itemCount}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="141.96686" y="288.90265" id="text704-52-08">
          <tspan id="tspan702-2-14" x="141.96686" y="288.90265" style="fill:#000000">{{items.0.product.description}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="141.11827" y="308.42029" id="text704-6-88">
          <tspan id="tspan702-6-4" x="141.11827" y="308.42029" style="fill:#000000">{{items.1.product.description}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="142.32582" y="327.93787" id="text704-52-08-0">
          <tspan id="tspan702-2-14-4" x="142.32582" y="327.93787" style="fill:#000000">{{items.2.product.description}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="141.47723" y="347.45551" id="text704-6-88-0">
          <tspan id="tspan702-6-4-6" x="141.47723" y="347.45551" style="fill:#000000">{{items.3.product.description}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="141.47723" y="366.12448" id="text704-52-08-5">
          <tspan id="tspan702-2-14-3" x="141.47723" y="366.12448" style="fill:#000000">{{items.4.product.description}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="140.62865" y="385.64212" id="text704-6-88-8">
          <tspan id="tspan702-6-4-5" x="140.62865" y="385.64212" style="fill:#000000">{{items.5.product.description}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="142.32582" y="404.3111" id="text704-52-08-1">
          <tspan id="tspan702-2-14-2" x="142.32582" y="404.3111" style="fill:#000000">{{items.6.product.description}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="141.47723" y="423.82874" id="text704-6-88-4">
          <tspan id="tspan702-6-4-67" x="141.47723" y="423.82874" style="fill:#000000">{{items.7.product.description}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="608.20264" y="288.05405" id="text704-52-08-4">
          <tspan id="tspan702-2-14-9" x="608.20264" y="288.05405" style="fill:#000000">{{items.0.unitPrice}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="609.94019" y="327.14786" id="text704-52-08-4-7">
          <tspan id="tspan702-2-14-9-0" x="609.94019" y="327.14786" style="fill:#000000">{{items.2.unitPrice}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="609.09155" y="346.6655" id="text704-6-88-44-9">
          <tspan id="tspan702-6-4-7-5" x="609.09155" y="346.6655" style="fill:#000000">{{items.3.unitPrice}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="609.94019" y="366.18307" id="text704-52-08-4-72">
          <tspan id="tspan702-2-14-9-9" x="609.94019" y="366.18307" style="fill:#000000">{{items.4.unitPrice}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="609.09155" y="385.70071" id="text704-6-88-44-7">
          <tspan id="tspan702-6-4-7-6" x="609.09155" y="385.70071" style="fill:#000000">{{items.5.unitPrice}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="609.94019" y="406.06686" id="text704-52-08-4-8">
          <tspan id="tspan702-2-14-9-2" x="609.94019" y="406.06686" style="fill:#000000">{{items.6.unitPrice}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="609.09155" y="425.5845" id="text704-6-88-44-99">
          <tspan id="tspan702-6-4-7-8" x="609.09155" y="425.5845" style="fill:#000000">{{items.7.unitPrice}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="607.354" y="307.57169" id="text704-6-88-44">
          <tspan id="tspan702-6-4-7" x="607.354" y="307.57169" style="fill:#000000">{{items.1.unitPrice}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="703.26508" y="287.65906" id="text704-52-08-4-5">
          <tspan id="tspan702-2-14-9-3" x="703.26508" y="287.65906" style="fill:#000000">{{items.0.lineItemTotalPrice.price}} {{items.0.lineItemTotalPrice.priceCurrency}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="705.00262" y="326.75287" id="text704-52-08-4-7-1">
          <tspan id="tspan702-2-14-9-0-1" x="705.00262" y="326.75287" style="fill:#000000">{{items.2.lineItemTotalPrice.price}} {{items.2.lineItemTotalPrice.priceCurrency}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="704.15399" y="346.27051" id="text704-6-88-44-9-2">
          <tspan id="tspan702-6-4-7-5-6" x="704.15399" y="346.27051" style="fill:#000000">{{items.3.lineItemTotalPrice.price}} {{items.3.lineItemTotalPrice.priceCurrency}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="705.00262" y="365.78809" id="text704-52-08-4-72-9">
          <tspan id="tspan702-2-14-9-9-1" x="705.00262" y="365.78809" style="fill:#000000">{{items.4.lineItemTotalPrice.price}} {{items.4.lineItemTotalPrice.priceCurrency}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="704.15399" y="385.30573" id="text704-6-88-44-7-9">
          <tspan id="tspan702-6-4-7-6-0" x="704.15399" y="385.30573" style="fill:#000000">{{items.5.lineItemTotalPrice.price}} {{items.5.lineItemTotalPrice.priceCurrency}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="705.00262" y="405.67188" id="text704-52-08-4-8-6">
          <tspan id="tspan702-2-14-9-2-1" x="705.00262" y="405.67188" style="fill:#000000">{{items.6.lineItemTotalPrice.price}} {{items.6.lineItemTotalPrice.priceCurrency}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="704.15399" y="425.18951" id="text704-6-88-44-99-7">
          <tspan id="tspan702-6-4-7-8-3" x="704.15399" y="425.18951" style="fill:#000000">{{items.7.lineItemTotalPrice.price}} {{items.7.lineItemTotalPrice.priceCurrency}}</tspan>
        </text>
        <text xml:space="preserve" style="fill:#eff2ff" x="702.41644" y="307.1767" id="text704-6-88-44-8">
          <tspan id="tspan702-6-4-7-7" x="702.41644" y="307.1767" style="fill:#000000">{{items.1.lineItemTotalPrice.price}} {{items.1.lineItemTotalPrice.priceCurrency}}</tspan>
        </text>
      </g>
    </svg>
    `)
  })
);

describe("SVG Renderer", () => {
  describe("with exist document.svgTemplate", () => {
    const document = svgTemplateCertificate;

    it("should render with purchaseOrderNo provided by the document", async () => {
      document.svgTemplateFile = undefined;
      document.svgTemplate = "purchaseOrderForm";

      render(<SVGRenderer document={document} />);

      expect(screen.findByTestId("svg-renderer-element")).resolves.toBeTruthy();
      expect(screen.findByText("fe71665a-e7b3-49ba-ac89-82fc2bf1e877")).resolves.toBeTruthy();
    });

    it("should render JSON for document", async () => {
      document.svgTemplateFile = undefined;
      document.svgTemplate = "invalid_template";

      render(<SVGRenderer document={document} />);

      const jsonRenderer = await waitFor(
        () => {
          return screen.findByTestId("json-renderer-element");
        },
        { timeout: 5000 }
      );
      expect(JSON.parse(jsonRenderer.textContent)).toEqual(document);
    });
  });

  describe("with exist document.svgTemplateFile", () => {
    const document = svgTemplateCertificate;

    it("should render with purchaseOrderNo provided by the document", async () => {
      document.svgTemplateFile = "http://localhost:3000/src/templates/samples/purchaseOrderForm.svg";
      document.svgTemplate = undefined;

      render(<SVGRenderer document={document} />);

      expect(screen.findByTestId("svg-renderer-element")).resolves.toBeTruthy();
      expect(screen.findByText("fe71665a-e7b3-49ba-ac89-82fc2bf1e877")).resolves.toBeTruthy();
    });

    it("should render JSON for document", async () => {
      document.svgTemplateFile = "invalid_url";
      document.svgTemplate = undefined;
      fetch = jest.fn(() => Promise.reject());

      render(<SVGRenderer document={document} />);

      const jsonRenderer = await waitFor(
        () => {
          return screen.findByTestId("json-renderer-element");
        },
        { timeout: 5000 }
      );
      expect(JSON.parse(jsonRenderer.textContent)).toEqual(document);
    });
  });
});
