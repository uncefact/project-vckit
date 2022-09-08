import { combineReducers } from "redux";
import certificate from "./certificate";
import { sample } from "./sample";
import { demoVerify } from "./demo-verify";
import { demoCreate } from "./demo-create";

export const createRootReducer = combineReducers({
  certificate,
  sample,
  demoVerify,
  demoCreate,
});

export type RootState = ReturnType<typeof createRootReducer>;
