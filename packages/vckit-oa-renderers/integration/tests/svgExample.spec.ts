import { Selector } from "testcafe";
import * as document from "../fixtures/svgDocument.json";

fixture("SVG Purchase Order Template").page`http://localhost:3000`;

const SVGTemplate = Selector("#svg-template");

test("SVG Purchase Order is rendered correctly", async test => {
  await test.eval(
    () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore can't find a way to have thos working on test cafe
      window.openAttestation({
        type: "RENDER_DOCUMENT",
        payload: {
          document
        }
      });
    },
    {
      dependencies: {
        document
      }
    }
  );
  // test the title is displayed
  await test.expect(SVGTemplate.visible).ok();
  await test.expect(SVGTemplate.textContent).contains("fe71665a-e7b3-49ba-ac89-82fc2bf1e877");
});
