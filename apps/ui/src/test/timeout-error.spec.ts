import { Selector } from "testcafe";
import { location, navigateToVerify, uploadDocument } from "./helper";

fixture("Timeout error").page`${location}`;

const TimeoutErrorMessage = Selector("h3").withText("Connection timeout on renderer");

test("Document with incorrect renderer url should timeout with error message", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/incorrect-renderer-url-ropsten.json");
  await t.expect(TimeoutErrorMessage.exists).ok("", { timeout: 45000 });
});
