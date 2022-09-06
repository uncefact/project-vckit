import { all } from "redux-saga/effects";
import certificateSaga from "./certificate";
import demoVerifySaga from "./demo-verify";
import demoCreateSaga from "./demo-create";

function* rootSaga() {
  yield all([...certificateSaga, ...demoVerifySaga, ...demoCreateSaga]);
}

export default rootSaga;
