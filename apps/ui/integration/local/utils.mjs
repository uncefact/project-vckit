// ChainSafe/dappeteer's metamask methods mostly doesn't not work out of box, fml

// manually dismiss banner!
// news popup keeps re-appearing AFTER some metamask actions
// clue (dasanra's fork) -> https://github.com/dasanra/dappeteer/commit/3656360e4f891a3e7d1e80e77a40b2cfb83af2c8
export const checkAndCloseNewsPopOver = async (metamask) => {
  await metamask.page.waitFor(1000);
  const isPopOverOpen = await metamask.page.evaluate(() => {
    return document.querySelector(".whats-new-popup__popover") !== null;
  });

  if (isPopOverOpen) {
    const closePopOverButton = await metamask.page.waitForSelector(".popover-header__button");
    await closePopOverButton.click();
  }
  await metamask.page.waitFor(1000);
};

// https://github.com/ChainSafe/dappeteer/issues/67
export const confirmTransaction = async (metamask) => {
  await metamask.confirmTransaction();
  await metamask.page.waitForSelector(".btn-primary:not([disabled])", { visible: true });
  await metamask.page.click(".btn-primary:not([disabled])");
  await checkAndCloseNewsPopOver(metamask);
};

// manually approve all accounts!
// https://github.com/ChainSafe/dappeteer/blob/master/src/metamask/approve.ts
export const approveAllAccounts = async (metamask) => {
  await metamask.page.bringToFront();
  await metamask.page.reload();

  const checkbox = await metamask.page.waitForSelector(".permissions-connect-choose-account__header-check-box");
  await checkbox.click();

  const button = await metamask.page.waitForSelector("button.button.btn-primary");
  await button.click();

  const connectButton = await metamask.page.waitForSelector("button.button.btn-primary");
  await connectButton.click();
};
