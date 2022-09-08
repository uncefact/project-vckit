import * as create from "../services/create";
import * as demoCreate from "../reducers/demo-create";

import { runSaga } from "redux-saga";
import { createDemoTempDns, deployDemoDocStore, issueDemoDocument, wrapDemoDocument } from "./demo-create";

async function recordSaga(saga, initialAction) {
  const dispatched = [];

  await runSaga(
    {
      getState: () => ({}),
      dispatch: (action) => dispatched.push(action),
    },
    saga,
    initialAction
  ).done;

  return dispatched;
}

describe("deployDemoDocStore", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should deploy document store", async () => {
    const initialAction = { type: "demo-create/deployingDocStore", payload: { signer: "SIGNER " } };

    jest.spyOn(create, "deployDocumentStore").mockImplementation(() => Promise.resolve("0x1234567890"));

    const dispatched = await recordSaga(deployDemoDocStore, initialAction);

    expect(dispatched).toStrictEqual([{ type: "demo-create/deployDocStoreSuccess", payload: "0x1234567890" }]);
  });

  it("should dispatch deployDocStoreFailure when deployDocumentStore fails", async () => {
    const initialAction = { type: "demo-create/deployingDocStore", payload: { signer: "SIGNER " } };

    jest
      .spyOn(create, "deployDocumentStore")
      .mockImplementation(() => Promise.reject(new Error("DEPLOY_DOC_STORE_ERROR")));

    const dispatched = await recordSaga(deployDemoDocStore, initialAction);

    expect(dispatched).toStrictEqual([
      { type: "demo-create/deployDocStoreFailure", payload: "DEPLOY_DOC_STORE_ERROR" },
    ]);
  });
});

describe("createDemoTempDns", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create temp dns", async () => {
    const initialAction = { type: "demo-create/deployDocStoreSuccess" };

    jest.spyOn(create, "createTempDns").mockImplementation(() => Promise.resolve("pink-little-turtle"));
    const getDocumentStoreAddress = jest
      .spyOn(demoCreate, "getDocumentStoreAddress")
      .mockImplementation(() => "0x1234567890");

    const dispatched = await recordSaga(createDemoTempDns, initialAction);

    expect(getDocumentStoreAddress).toHaveBeenCalledTimes(1);
    expect(dispatched).toStrictEqual([
      { type: "demo-create/creatingTempDns" },
      { type: "demo-create/createTempDnsSuccess", payload: "pink-little-turtle" },
    ]);
  });

  it("should dispatch createTempDnsFailure when createTempDns fails", async () => {
    const initialAction = { type: "demo-create/deployDocStoreSuccess" };

    jest.spyOn(create, "createTempDns").mockImplementation(() => Promise.reject(new Error("CREATE_TEMP_DNS_ERROR")));
    const getDocumentStoreAddress = jest
      .spyOn(demoCreate, "getDocumentStoreAddress")
      .mockImplementation(() => "0x1234567890");

    const dispatched = await recordSaga(createDemoTempDns, initialAction);

    expect(getDocumentStoreAddress).toHaveBeenCalledTimes(1);
    expect(dispatched).toStrictEqual([
      { type: "demo-create/creatingTempDns" },
      { type: "demo-create/createTempDnsFailure", payload: "CREATE_TEMP_DNS_ERROR" },
    ]);
  });
});

describe("wrapDemoDocument", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should wrap a document", async () => {
    const initialAction = { type: "demo-create/wrappingDocument", payload: { documentName: "DOCUMENT_NAME" } };

    jest.spyOn(create, "getWrappedDocument").mockImplementation(() => Promise.resolve({ name: "WRAPPED_DOCUMENT" }));

    const dispatched = await recordSaga(wrapDemoDocument, initialAction);

    expect(dispatched).toStrictEqual([
      {
        type: "demo-create/wrapDocumentSuccess",
        payload: { name: "WRAPPED_DOCUMENT" },
      },
    ]);
  });

  it("should dispatch wrapDocumentFailure when getWrappedDocument fails", async () => {
    const initialAction = { type: "demo-create/wrappingDocument", payload: { documentName: "DOCUMENT_NAME" } };

    jest
      .spyOn(create, "getWrappedDocument")
      .mockImplementation(() => Promise.reject(new Error("GET_WRAPPED_DOCUMENT_ERROR")));

    const dispatched = await recordSaga(wrapDemoDocument, initialAction);

    expect(dispatched).toStrictEqual([
      {
        type: "demo-create/wrapDocumentFailure",
        payload: "GET_WRAPPED_DOCUMENT_ERROR",
      },
    ]);
  });
});

describe("issueDemoDocument", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should issue a document", async () => {
    const initialAction = { type: "demo-create/issuingDocument", payload: { signer: "SIGNER" } };

    const getDocumentStoreAddress = jest
      .spyOn(demoCreate, "getDocumentStoreAddress")
      .mockImplementation(() => "0x1234567890");
    const getDemoWrappedDocument = jest
      .spyOn(demoCreate, "getWrappedDocument")
      .mockImplementation(() => ({ name: "WRAPPED_DOCUMENT" }));

    jest.spyOn(create, "publishDocument").mockImplementation(() => Promise.resolve());

    const dispatched = await recordSaga(issueDemoDocument, initialAction);

    expect(getDocumentStoreAddress).toHaveBeenCalledTimes(1);
    expect(getDemoWrappedDocument).toHaveBeenCalledTimes(1);

    expect(dispatched).toStrictEqual([
      {
        type: "demo-create/issueDocumentSuccess",
        payload: undefined,
      },
    ]);
  });

  it("should dispatch issueDocumentFailure when publishDocument fails", async () => {
    const initialAction = { type: "demo-create/issuingDocument", payload: { signer: "SIGNER" } };

    const getDocumentStoreAddress = jest
      .spyOn(demoCreate, "getDocumentStoreAddress")
      .mockImplementation(() => "0x1234567890");
    const getDemoWrappedDocument = jest
      .spyOn(demoCreate, "getWrappedDocument")
      .mockImplementation(() => ({ name: "WRAPPED_DOCUMENT" }));

    jest.spyOn(create, "publishDocument").mockImplementation(() => Promise.reject(new Error("PUBLISH_DOCUMENT_ERROR")));

    const dispatched = await recordSaga(issueDemoDocument, initialAction);

    expect(getDocumentStoreAddress).toHaveBeenCalledTimes(1);
    expect(getDemoWrappedDocument).toHaveBeenCalledTimes(1);

    expect(dispatched).toStrictEqual([
      {
        type: "demo-create/issueDocumentFailure",
        payload: "PUBLISH_DOCUMENT_ERROR",
      },
    ]);
  });
});
