import expect from "expect-puppeteer";
import { confirmTransaction } from "./utils.mjs";

export const surrender = async (metamask, browser) => {
  // force process to exit if any assertion fail
  try {
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/verify");

    const inputUploadHandle = await page.$("input[type=file]");
    inputUploadHandle.uploadFile("./integration/local/ebl-surrender.json");

    await page.waitForSelector("[data-testid='connectToWallet']", { visible: true });
    await page.click("[data-testid='connectToWallet']");

    await page.waitFor(1500);
    await page.waitForSelector("[data-testid='manageAssetDropdown']", { visible: true });
    await page.click("[data-testid='manageAssetDropdown']");

    await page.waitForSelector("[data-testid='surrenderDropdown']", { visible: true });
    await page.click("[data-testid='surrenderDropdown']");

    await page.waitForSelector("[data-testid='surrenderBtn']", { visible: true });
    await page.click("[data-testid='surrenderBtn']");

    await page.waitFor(1500);
    await confirmTransaction(metamask);
    await page.bringToFront();
    await page.waitFor(1500);

    await expect(page).toMatchElement("#surrender-sign", {
      text: "Surrendered To Issuer",
      visible: true,
    });

    await expect(page).toMatchElement("[data-testid='overlay-title']", {
      text: "Surrender Document Success",
      visible: true,
    });

    await page.close();

    console.log("✅ Surrender success");
  } catch (e) {
    console.log("❌ Surrender fail");
    console.log(e);
    process.exit(1);
  }
};
