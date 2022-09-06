import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configRopsten } from "./helper";

fixture("Custom array ordering").page`http://localhost:3000`;

const AddItem = Selector("button").withText("Add Item");
const Desc0 = Selector(`[data-testid="custom-array-field-0"] input[label="Description"]`);
const Desc1 = Selector(`[data-testid="custom-array-field-1"] input[label="Description"]`);
const Desc2 = Selector(`[data-testid="custom-array-field-2"] input[label="Description"]`);
const MoveDown0 = Selector(`[data-testid="custom-array-field-0"] [data-testid="move-down"]`);
const MoveUp2 = Selector(`[data-testid="custom-array-field-2"] [data-testid="move-up"]`);
const Remove0 = Selector(`[data-testid="custom-array-field-0"] [data-testid="remove"]`);

test("should add, order, remove correctly", async (t) => {
  await loadConfigFile(configRopsten);
  await enterPassword("password");
  await t.click(Selector("button").withText("TradeTrust Invoice v2"));

  await t.click(AddItem);
  await t.typeText(Desc0, "foobar");
  await t.expect(Desc0.value).eql("foobar");
  await t.click(AddItem);

  await t.click(MoveDown0);
  await t.expect(Desc0.value).eql("");
  await t.expect(Desc1.value).eql("foobar");

  await t.click(AddItem);
  await t.click(MoveUp2);

  await t.expect(Desc1.value).eql("");
  await t.expect(Desc2.value).eql("foobar");

  await t.click(Remove0);
  await t.expect(Desc1.value).eql("foobar");
});
