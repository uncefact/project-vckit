import { put, select, takeEvery } from "redux-saga/effects";
import { getLogger } from "../utils/logger";
import {
  types,
  verifyingCertificateCompleted,
  verifyingCertificateFailure,
  getCertificate,
} from "../reducers/certificate";
import { processQrCode } from "../services/qrProcessor";
import { verifyDocument } from "../services/verify";
import { isValid } from "@govtechsg/oa-verify";
import { decryptString } from "@govtechsg/oa-encryption";
import { NETWORK_NAME } from "../config";
import { history } from "../history";
import { CONSTANTS } from "@govtechsg/tradetrust-utils";

const { trace } = getLogger("saga:certificate");

const { TYPES } = CONSTANTS;

export function* verifyCertificate(): any {
  try {
    yield put({
      type: types.VERIFYING_CERTIFICATE,
    });

    const certificate = yield select(getCertificate);
    const verificationStatus = yield verifyDocument(certificate);
    trace(`Verification Status: ${JSON.stringify(verificationStatus)}`);

    // Instead of success/failure, report completeness
    yield put(verifyingCertificateCompleted(verificationStatus));
    if (NETWORK_NAME === "local" ? true : isValid(verificationStatus)) {
      yield history.push("/viewer");
    }
  } catch (e) {
    yield put(verifyingCertificateFailure(TYPES.CLIENT_NETWORK_ERROR));
  }
}

export function* handleQrScanned({ payload: qrCode }: { type: string; payload: any }): any {
  try {
    const { payload, anchor } = yield processQrCode(qrCode);

    yield put({
      type: types.RETRIEVE_CERTIFICATE_BY_ACTION,
      payload,
      anchor,
    });
  } catch (e) {
    yield put(verifyingCertificateFailure(TYPES.CLIENT_NETWORK_ERROR));
  }
}

export function* retrieveCertificateByAction({
  payload: { uri, key: payloadKey },
  anchor: { key: anchorKey },
}: {
  type: string;
  payload: { uri: any; key: any };
  anchor: { key: any };
}): any {
  try {
    yield put({
      type: types.RETRIEVE_CERTIFICATE_BY_ACTION_PENDING,
    });

    const key = anchorKey || payloadKey;

    // if a key has been provided, let's assume
    let certificate = yield window.fetch(uri).then((response) => {
      if (response.status >= 400 && response.status < 600) {
        throw new Error(`Unable to load the certificate from ${uri}`);
      }
      return response.json();
    });
    certificate = certificate.data.document || certificate.document || certificate; // opencerts-function returns the document in a nested document object

    if (!certificate) {
      throw new Error(`Certificate at address ${uri} is empty`);
    }

    // will only decrypt if type is `OPEN-ATTESTATION-TYPE-1`, so far only oa-encryption uses this
    if (certificate.type === "OPEN-ATTESTATION-TYPE-1") {
      if (key) {
        const decryptedCertificate = decryptString({
          tag: certificate.tag,
          cipherText: certificate.cipherText,
          iv: certificate.iv,
          key,
          type: certificate.type,
        });
        certificate = JSON.parse(decryptedCertificate);
      } else {
        throw new Error(`Unable to decrypt certificate with key=${key} and type=${certificate.type}`);
      }
    }

    yield put({
      type: types.UPDATE_CERTIFICATE,
      payload: certificate,
    });
    yield put({
      type: types.RETRIEVE_CERTIFICATE_BY_ACTION_SUCCESS,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield put({
        type: types.RETRIEVE_CERTIFICATE_BY_ACTION_FAILURE,
        payload: e.message,
      });
    }
  }
}

export default [
  takeEvery(types.CERTIFICATE_PROCESS_QR_CODE, handleQrScanned),
  takeEvery(types.UPDATE_CERTIFICATE, verifyCertificate),
  takeEvery(types.RETRIEVE_CERTIFICATE_BY_ACTION, retrieveCertificateByAction),
];
