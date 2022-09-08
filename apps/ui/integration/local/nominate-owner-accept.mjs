import expect from "expect-puppeteer";
import { confirmTransaction } from "./utils.mjs";

export const nominateOwnerAccept = async (metamask, browser) => {
  // force process to exit if any assertion fail
  try {
    await metamask.switchAccount(2);

    const page = await browser.newPage();
    await page.goto("http://localhost:3000/verify");

    const inputUploadHandle = await page.$("input[type=file]");
    inputUploadHandle.uploadFile("./integration/local/ebl-nominate-owner.json"); // use back the same ebl

    await page.waitForSelector("[data-testid='connectToWallet']", { visible: true });
    await page.click("[data-testid='connectToWallet']");

    await page.waitFor(1500);
    await page.waitForSelector("[data-testid='manageAssetDropdown']", { visible: true });
    await page.click("[data-testid='manageAssetDropdown']");

    await page.waitForSelector("[data-testid='endorseTransferDropdown']", { visible: true });
    await page.click("[data-testid='endorseTransferDropdown']");

    await page.waitForSelector("[data-testid='endorseTransferBtn']", { visible: true });
    await page.click("[data-testid='endorseTransferBtn']");

    await page.waitFor(1500);
    await confirmTransaction(metamask);
    await page.bringToFront();
    await page.waitFor(1500);

    await expect(page).toMatchElement("[data-testid='non-editable-input-owner']", {
      text: "0xcDFAcbb428DD30ddf6d99875dcad04CbEFcd6E60",
      visible: true,
    });

    await expect(page).toMatchElement("[data-testid='non-editable-input-holder']", {
      text: "0xcDFAcbb428DD30ddf6d99875dcad04CbEFcd6E60",
      visible: true,
    });

    await expect(page).toMatchElement("[data-testid='overlay-title']", {
      text: "Endorse Ownership/Holdership Success",
      visible: true,
    });

    await page.close();
    await metamask.switchAccount(1);

    console.log("✅ Nominate owner accept success");
  } catch (e) {
    console.log("❌ Nominate owner accept fail");
    console.log(e);
    process.exit(1);
  }
};
