import { createSlice } from "@reduxjs/toolkit";
import { VerificationFragment } from "@govtechsg/oa-verify";

// TODO: from the looks it needs this states, update once demo flow is more confirmed
interface DemoVerifyState {
  rawDocument: string | null;
  rawModifiedDocument: string | null;

  verificationPending: boolean;
  verificationStatus: VerificationFragment[] | null;
  verificationError: string | null;
}

const initialState = {
  rawDocument: null,
  rawModifiedDocument: null,

  verificationPending: false,
  verificationStatus: null,
  verificationError: null,
} as DemoVerifyState;

const demoVerifySlice = createSlice({
  name: "demo-verify",
  initialState,
  reducers: {
    resetDemoState: (state) => {
      state.rawDocument = null;
      state.rawModifiedDocument = null;
      state.verificationPending = false;
      state.verificationStatus = null;
      state.verificationError = null;
    },
    updateDemoDocument: (state, action) => {
      state.rawDocument = action.payload;
      state.rawModifiedDocument = action.payload;
    },
    verifyingDemoDocument: (state) => {
      state.verificationPending = true;
      state.verificationStatus = null;
    },
    verifyDemoDocumentCompleted: (state, action) => {
      state.verificationPending = false;
      state.verificationStatus = action.payload;
    },
    verifyDemoDocumentFailure: (state, action) => {
      state.verificationPending = false;
      state.verificationError = action.payload;
    },
  },
});

// Selectors
export const getDemoDocument = (store: { demoVerify: { rawModifiedDocument: string } }): string => {
  return store.demoVerify.rawModifiedDocument;
};

export const {
  resetDemoState,
  updateDemoDocument,
  verifyingDemoDocument,
  verifyDemoDocumentCompleted,
  verifyDemoDocumentFailure,
} = demoVerifySlice.actions;

export const demoVerify = demoVerifySlice.reducer;
