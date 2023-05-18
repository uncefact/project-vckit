import { Selector } from "testcafe";
import * as document from "../fixtures/document.json";

fixture("Custom Red Certificate Template").page`http://localhost:3000`;

const CustomTemplate = Selector("#custom-template");

test("Custom certificate is rendered correctly", async test => {
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
  await test.expect(CustomTemplate.visible).ok();
  await test.expect(CustomTemplate.textContent).contains("Bar is awesome");
});
