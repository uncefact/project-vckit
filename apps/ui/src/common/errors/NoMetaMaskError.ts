import { MessageTitle } from "@govtechsg/tradetrust-ui-components";

export class NoMetaMaskError extends Error {
  constructor() {
    super(MessageTitle.NO_METAMASK);
    this.name = "NoMetaMaskError";
  }
}
