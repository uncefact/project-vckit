import expect from "expect-puppeteer";
import { confirmTransaction } from "./utils.mjs";

export const endorseOwner = async (metamask, browser) => {
  // force process to exit if any assertion fail
  try {
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/verify");

    const inputUploadHandle = await page.$("input[type=file]");
    inputUploadHandle.uploadFile("./integration/local/ebl-endorse-owner.json");

    await page.waitForSelector("[data-testid='connectToWallet']", { visible: true });
    await page.click("[data-testid='connectToWallet']");

    await page.waitFor(1500);
    await page.waitForSelector("[data-testid='manageAssetDropdown']", { visible: true });
    await page.click("[data-testid='manageAssetDropdown']");

    await page.waitForSelector("[data-testid='endorseBeneficiaryDropdown']", { visible: true });
    await page.click("[data-testid='endorseBeneficiaryDropdown']");

    await page.waitForSelector("[data-testid='editable-input-owner']", { visible: true });
    await page.focus("[data-testid='editable-input-owner']");
    await page.keyboard.type("0x391aFf3942857a10958425FebF1fC1938D9F5AE7");

    await page.waitForSelector("[data-testid='editable-input-holder']", { visible: true });
    await page.focus("[data-testid='editable-input-holder']");
    await page.keyboard.type("0xcDFAcbb428DD30ddf6d99875dcad04CbEFcd6E60");

    await page.waitForSelector("[data-testid='endorseBtn']", { visible: true });
    await page.click("[data-testid='endorseBtn']");

    await page.waitFor(1500);
    await confirmTransaction(metamask);
    await page.bringToFront();
    await page.waitFor(1500);

    await expect(page).toMatchElement("[data-testid='non-editable-input-owner']", {
      text: "0x391aFf3942857a10958425FebF1fC1938D9F5AE7",
      visible: true,
    });

    await expect(page).toMatchElement("[data-testid='overlay-title']", {
      text: "Change Owner Success",
      visible: true,
    });

    await page.close();

    console.log("✅ Endorse owner success");
  } catch (e) {
    console.log("❌ Endorse owner fail");
    console.log(e);
    process.exit(1);
  }
};
