import {
  demoVerify,
  resetDemoState,
  updateDemoDocument,
  verifyingDemoDocument,
  verifyDemoDocumentCompleted,
  verifyDemoDocumentFailure,
} from "./demo-verify";

describe("demo", () => {
  let initialState: any;
  beforeEach(() => {
    initialState = {
      rawDocument: null,
      rawModifiedDocument: null,
      verificationPending: false,
      verificationStatus: null,
      verificationError: null,
    };
  });

  it("should set the correct state from payload when updateDemoDocument is called", () => {
    const finalState = {
      rawDocument: "demoDocument",
      rawModifiedDocument: "demoDocument",
      verificationPending: false,
      verificationStatus: null,
      verificationError: null,
    };
    const state = demoVerify(initialState, updateDemoDocument("demoDocument"));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state when verifyingDemoDocument is called", () => {
    const finalState = {
      rawDocument: null,
      rawModifiedDocument: null,
      verificationPending: true,
      verificationStatus: null,
      verificationError: null,
    };
    const state = demoVerify(initialState, verifyingDemoDocument());
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state when verifyDemoDocumentCompleted is called", () => {
    const finalState = {
      rawDocument: null,
      rawModifiedDocument: null,
      verificationPending: false,
      verificationStatus: "completed",
      verificationError: null,
    };
    const state = demoVerify(initialState, verifyDemoDocumentCompleted("completed"));
    expect(state).toStrictEqual(finalState);
  });

  it("should set the correct state when verifyDemoDocumentFailure is called", () => {
    const finalState = {
      rawDocument: null,
      rawModifiedDocument: null,
      verificationPending: false,
      verificationStatus: null,
      verificationError: "failed",
    };
    const state = demoVerify(initialState, verifyDemoDocumentFailure("failed"));
    expect(state).toStrictEqual(finalState);
  });

  it("should reset the state when resetDemoDocument is called", () => {
    const action1 = demoVerify(initialState, updateDemoDocument("demoDocument"));
    const action2 = demoVerify(action1, verifyingDemoDocument());
    const action3 = demoVerify(action2, verifyDemoDocumentCompleted("completed"));
    const action4 = demoVerify(action3, verifyDemoDocumentFailure("failed"));
    const resetState = demoVerify(action4, resetDemoState());
    expect(resetState).toStrictEqual(initialState);
  });
});
