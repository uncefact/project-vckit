import { Selector } from "testcafe";

fixture("Settings").page`http://localhost:3000`;

test("should lead to its own settings page correctly", async (t) => {
  await t.click(Selector("[data-testid='navbar-settings']"));
  await t.expect(Selector("[data-testid='page-title']").withText("Settings").exists).ok();
});
