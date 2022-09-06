import {
  initialState as defaultInitialState,
  demoCreate,
  deployDocStoreSuccess,
  deployDocStoreFailure,
  deployingDocStore,
  creatingTempDns,
  createTempDnsSuccess,
  createTempDnsFailure,
  wrappingDocument,
  wrapDocumentSuccess,
  wrapDocumentFailure,
  issuingDocument,
  issueDocumentSuccess,
  issueDocumentFailure,
} from "./demo-create";

describe("demo", () => {
  let initialState: any;
  beforeEach(() => {
    initialState = { ...defaultInitialState };
  });

  it("should set the correct state when deployingDocStore is called", () => {
    const finalState = {
      ...initialState,
      deploymentDocStoreStatus: "pending",
    };

    const state = demoCreate(initialState, deployingDocStore({ signer: "SIGNER" }));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state from payload when deployDocStoreSuccess is called", () => {
    const finalState = {
      ...initialState,
      documentStoreAddress: "0xfbb61b8b98a59fbc4bd79c23212addbefaeb289f",
      deploymentDocStoreStatus: "success",
    };

    const state = demoCreate(initialState, deployDocStoreSuccess("0xfbb61b8b98a59fbc4bd79c23212addbefaeb289f"));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state from payload when deployDocStoreFailure is called", () => {
    const finalState = {
      ...initialState,
      deploymentDocStoreError: "Error: some error message",
      deploymentDocStoreStatus: "failure",
    };

    const state = demoCreate(initialState, deployDocStoreFailure("Error: some error message"));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state when creatingTempDns is called", () => {
    const finalState = {
      ...initialState,
      createTempDnsStatus: "pending",
    };

    const state = demoCreate(initialState, creatingTempDns());
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state from payload when createTempDnsSuccess is called", () => {
    const finalState = {
      ...initialState,
      tempDns: "cool-pink-rabbit",
      createTempDnsStatus: "success",
    };

    const state = demoCreate(initialState, createTempDnsSuccess("cool-pink-rabbit"));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state from payload when createTempDnsFailure is called", () => {
    const finalState = {
      ...initialState,
      createTempDnsError: "Error: some error message",
      createTempDnsStatus: "failure",
    };

    const state = demoCreate(initialState, createTempDnsFailure("Error: some error message"));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state when wrappingDocument is called", () => {
    const finalState = {
      ...initialState,
      wrapDocumentStatus: "pending",
    };

    const state = demoCreate(initialState, wrappingDocument({ documentName: "DOCUMENT_NAME" }));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state from payload when wrapDocumentSuccess is called", () => {
    const finalState = {
      ...initialState,
      wrappedDocument: { name: "WRAPPED_DOCUMENT" },
      wrapDocumentStatus: "success",
    };

    const state = demoCreate(initialState, wrapDocumentSuccess({ name: "WRAPPED_DOCUMENT" }));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state from payload when wrapDocumentFailure is called", () => {
    const finalState = {
      ...initialState,
      wrapDocumentError: "Error: some error message",
      wrapDocumentStatus: "failure",
    };

    const state = demoCreate(initialState, wrapDocumentFailure("Error: some error message"));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state when issuingDocument is called", () => {
    const finalState = {
      ...initialState,
      issueDocumentStatus: "pending",
    };

    const state = demoCreate(initialState, issuingDocument({ signer: "SIGNER" }));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state from payload when issueDocumentSuccess is called", () => {
    const finalState = {
      ...initialState,
      issueDocumentStatus: "success",
    };

    const state = demoCreate(initialState, issueDocumentSuccess());
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state from payload when issueDocumentFailure is called", () => {
    const finalState = {
      ...initialState,
      issueDocumentError: "Error: some error message",
      issueDocumentStatus: "failure",
    };

    const state = demoCreate(initialState, issueDocumentFailure("Error: some error message"));
    expect(state).toStrictEqual(finalState);
  });
});
