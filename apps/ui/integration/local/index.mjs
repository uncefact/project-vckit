import { metamaskInit } from "./metamask-init.mjs";
import { transferHolder } from "./transfer-holder.mjs";
import { endorseOwner } from "./endorse-owner.mjs";
import { nominateOwner } from "./nominate-owner.mjs";
import { nominateOwnerAccept } from "./nominate-owner-accept.mjs";
import { surrender } from "./surrender.mjs";
import { surrenderReject } from "./surrender-reject.mjs";
import { surrenderAccept } from "./surrender-accept.mjs";

const main = async () => {
  const { metamask, browser } = await metamaskInit();
  await transferHolder(metamask, browser);
  await endorseOwner(metamask, browser);
  await nominateOwner(metamask, browser);
  await nominateOwnerAccept(metamask, browser);
  await surrender(metamask, browser);
  await surrenderReject(metamask, browser);
  await surrender(metamask, browser); // surrender again to test accept surrender flow
  await surrenderAccept(metamask, browser);

  // assuming all previous try catch passed, close and exit
  await browser.close();
  process.exit(0);
};

main();
