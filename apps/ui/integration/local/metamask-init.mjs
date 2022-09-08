import puppeteer from "puppeteer";
import dappeteer from "@chainsafe/dappeteer";

export const metamaskInit = async () => {
  try {
    const browser = await dappeteer.launch(puppeteer, {
      metamaskVersion: "v10.1.1", // latest version looks like don't even assume default networks, need to manual add them
      args: ["--no-sandbox"],
      executablePath: process.env.PUPPETEER_EXEC_PATH,
      headless: false, // must be false, so can test with metamask extension
      defaultViewport: null,
      // slowMo: 5,
    });
    const version = await browser.version();
    const metamask = await dappeteer.setupMetamask(browser, {
      seed: "indicate swing place chair flight used hammer soon photo region volume shuffle",
    });

    await metamask.switchNetwork("localhost");
    await metamask.importPK("0xc58c1ff75001afdca8cecb61b47f36964febe4188b8f7b26252286ecae5a8879");
    await metamask.switchAccount(1);

    console.log("✅ Metamask account init success");
    console.log(`❤️ Browser version: ${version}`);
    return { metamask, browser };
  } catch (e) {
    console.log("❌ Metamask account init fail");
    console.log(e);
    process.exit(1);
  }
};
