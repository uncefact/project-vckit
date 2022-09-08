import { put, select, takeEvery } from "redux-saga/effects";
import { getLogger } from "../utils/logger";
import { verifyDemoDocumentCompleted, verifyDemoDocumentFailure, getDemoDocument } from "../reducers/demo-verify";
import { verifyDocument, VerifierType } from "../services/verify";
import { isValid } from "@govtechsg/oa-verify";
import { NETWORK_NAME } from "../config";
import { history } from "../history";
import { CONSTANTS } from "@govtechsg/tradetrust-utils";

const { trace } = getLogger("saga:demo");

export function* verifyDemoDocument(): any {
  const { TYPES } = CONSTANTS;
  try {
    yield put({
      type: "demo-verify/verifyingDemoDocument",
    });

    const demoDocument = yield select(getDemoDocument);
    const verificationStatus = yield verifyDocument(demoDocument, VerifierType.DEMO);
    trace(`Verification Status: ${JSON.stringify(verificationStatus)}`);

    yield put(verifyDemoDocumentCompleted(verificationStatus));

    if (NETWORK_NAME === "local" ? true : isValid(verificationStatus)) {
      yield history.push("/demo/viewer");
    }
  } catch (e) {
    yield put(verifyDemoDocumentFailure(TYPES.CLIENT_NETWORK_ERROR));
  }
}

export default [takeEvery("demo-verify/updateDemoDocument", verifyDemoDocument)];
