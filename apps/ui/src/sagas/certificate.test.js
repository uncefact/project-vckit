import * as certificate from "../reducers/certificate";
import * as verify from "../services/verify";
import { verifyCertificate } from "./certificate";
import {
  whenDocumentValidAndIssuedByDns,
  whenDocumentHashInvalidAndNotIssued,
} from "../test/fixture/verifier-responses";
import { runSaga } from "redux-saga";
import { CONSTANTS } from "@govtechsg/tradetrust-utils";

async function recordSaga(saga, initialAction) {
  const dispatched = [];
  await runSaga(
    {
      getState: () => ({ demo: { rawModifiedDocument: "DOCUMENT_OBJECT" } }),
      dispatch: (action) => dispatched.push(action),
    },
    saga,
    initialAction
  ).done;

  return dispatched;
}

const { TYPES } = CONSTANTS;

describe("verifyCertificate", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should verify the document and change the router to /viewer when verification passes", async () => {
    const initialAction = { type: certificate.types.UPDATE_CERTIFICATE };
    const getCertificate = jest
      .spyOn(certificate, "getCertificate")
      .mockImplementation(() => Promise.resolve(whenDocumentValidAndIssuedByDns));
    const verifyDocument = jest
      .spyOn(verify, "verifyDocument")
      .mockImplementation(() => Promise.resolve(whenDocumentValidAndIssuedByDns));
    const dispatched = await recordSaga(verifyCertificate, initialAction);

    expect(getCertificate).toHaveBeenCalledTimes(1);
    expect(verifyDocument).toHaveBeenCalledTimes(1);
    expect(dispatched).toContainEqual({
      type: certificate.types.VERIFYING_CERTIFICATE_COMPLETED,
      payload: whenDocumentValidAndIssuedByDns,
    });
  });

  it("should verify the document and do not update the router when verification fails", async () => {
    const initialAction = { type: certificate.types.UPDATE_CERTIFICATE };
    const getCertificate = jest
      .spyOn(certificate, "getCertificate")
      .mockImplementation(() => Promise.resolve(whenDocumentHashInvalidAndNotIssued));
    const verifyDocument = jest
      .spyOn(verify, "verifyDocument")
      .mockImplementation(() => Promise.reject(new Error("Failed to verify document")));
    const dispatched = await recordSaga(verifyCertificate, initialAction);

    expect(getCertificate).toHaveBeenCalledTimes(1);
    expect(verifyDocument).toHaveBeenCalledTimes(1);
    expect(dispatched).toContainEqual({
      type: certificate.types.VERIFYING_CERTIFICATE_FAILURE,
      payload: TYPES.CLIENT_NETWORK_ERROR,
    });
  });
});
