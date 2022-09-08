export {
  listHandler as listAllHandler,
  getHandler as getConfigHandler,
} from "./config/get";
export { handler as createConfigHandler } from "./config/create";
export { handler as deleteConfigHandler } from "./config/delete";
export { handler as updateConfigHandler } from "./config/update";
export { handler as seedConfigHandler } from "./seed/configFile";
export { handler as createHandler } from "./storage/create";
export { handler as getHandler } from "./storage/get";
export { handleIssue, handleVerify, handleStatus } from "./vc";
