import expect from "expect-puppeteer";
import { confirmTransaction } from "./utils.mjs";

export const nominateOwner = async (metamask, browser) => {
  // force process to exit if any assertion fail
  try {
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/verify");

    const inputUploadHandle = await page.$("input[type=file]");
    inputUploadHandle.uploadFile("./integration/local/ebl-nominate-owner.json");

    await page.waitForSelector("[data-testid='connectToWallet']", { visible: true });
    await page.click("[data-testid='connectToWallet']");

    await page.waitFor(1500);
    await page.waitForSelector("[data-testid='manageAssetDropdown']", { visible: true });
    await page.click("[data-testid='manageAssetDropdown']");

    await page.waitForSelector("[data-testid='nominateBeneficiaryHolderDropdown']", { visible: true });
    await page.click("[data-testid='nominateBeneficiaryHolderDropdown']");

    await page.waitForSelector("[data-testid='editable-input-owner']", { visible: true });
    await page.focus("[data-testid='editable-input-owner']");
    await page.keyboard.type("0xcDFAcbb428DD30ddf6d99875dcad04CbEFcd6E60");

    await page.waitForSelector("[data-testid='nominationBtn']", { visible: true });
    await page.click("[data-testid='nominationBtn']");

    await page.waitFor(1500);
    await confirmTransaction(metamask);
    await page.bringToFront();
    await page.waitFor(1500);

    await expect(page).toMatchElement("[data-testid='non-editable-input-owner']", {
      text: "0xe0A71284EF59483795053266CB796B65E48B5124",
      visible: true,
    }); // not changed yet, so should be still previous address

    await expect(page).toMatchElement("[data-testid='overlay-title']", {
      text: "Nomination Success",
      visible: true,
    });

    await page.close();

    console.log("✅ Nominate owner success");
  } catch (e) {
    console.log("❌ Nominate owner fail");
    console.log(e);
    process.exit(1);
  }
};
