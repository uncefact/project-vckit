export class UnsupportedNetworkError extends Error {
  constructor(chainIdOrName?: number | string) {
    super(`Unsupported network chain ID or name${chainIdOrName ? ` (${chainIdOrName})` : ""}`);
    this.name = "UnsupportedNetworkError";
  }
}
