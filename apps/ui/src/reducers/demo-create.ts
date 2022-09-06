import { createSlice } from "@reduxjs/toolkit";
import { WrappedDocument } from "@govtechsg/open-attestation/dist/types/3.0/types";
import { RootState } from "./";

type Status = "failure" | "success" | "pending";
interface DemoCreateState {
  documentStoreAddress: string | null;
  deploymentDocStoreStatus: Status | null;
  deploymentDocStoreError: string | null;

  tempDns: string | null;
  createTempDnsStatus: Status | null;
  createTempDnsError: string | null;

  wrappedDocument: WrappedDocument<any> | null;
  wrapDocumentStatus: Status | null;
  wrapDocumentError: string | null;

  issueDocumentStatus: Status | null;
  issueDocumentError: Status | null;
}

export const initialState: Record<string, any> = {
  documentStoreAddress: null,
  deploymentDocStoreStatus: null,
  deploymentDocStoreError: null,

  tempDns: null,
  createTempDnsStatus: null,
  createTempDnsError: null,

  wrappedDocument: null,
  wrapDocumentStatus: null,
  wrapDocumentError: null,

  issueDocumentStatus: null,
  issueDocumentError: null,
} as DemoCreateState;

const demoCreateSlice = createSlice({
  name: "demo-create",
  initialState,
  reducers: {
    resetDemoCreateState: (state) => {
      Object.keys(state).forEach((key: string) => {
        delete state[key];
      });
      Object.entries(initialState).forEach(([key, value]) => {
        state[key] = value;
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deployingDocStore: (state, _) => {
      state.deploymentDocStoreStatus = "pending";
    },
    deployDocStoreSuccess: (state, action) => {
      state.documentStoreAddress = action.payload;
      state.deploymentDocStoreStatus = "success";
    },
    deployDocStoreFailure: (state, action) => {
      state.deploymentDocStoreError = action.payload;
      state.deploymentDocStoreStatus = "failure";
    },

    creatingTempDns: (state) => {
      state.createTempDnsStatus = "pending";
    },
    createTempDnsSuccess: (state, action) => {
      state.tempDns = action.payload;
      state.createTempDnsStatus = "success";
    },
    createTempDnsFailure: (state, action) => {
      state.createTempDnsError = action.payload;
      state.createTempDnsStatus = "failure";
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wrappingDocument: (state, _) => {
      state.wrapDocumentStatus = "pending";
    },
    wrapDocumentSuccess: (state, action) => {
      state.wrappedDocument = action.payload;
      state.wrapDocumentStatus = "success";
    },
    wrapDocumentFailure: (state, action) => {
      state.wrapDocumentStatus = "failure";
      state.wrapDocumentError = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    issuingDocument: (state, _) => {
      state.issueDocumentStatus = "pending";
    },
    issueDocumentSuccess: (state) => {
      state.issueDocumentStatus = "success";
    },
    issueDocumentFailure: (state, action) => {
      state.issueDocumentError = action.payload;
      state.issueDocumentStatus = "failure";
    },
  },
});

export const getDocumentStoreAddress = (store: RootState): string => {
  return store.demoCreate.documentStoreAddress;
};

export const getTempDns = (store: RootState): string => {
  return store.demoCreate.tempDns;
};

export const getWrappedDocument = (store: RootState): WrappedDocument<any> => {
  return store.demoCreate.wrappedDocument;
};

export const getWrappedDocumentStatus = (store: RootState): Status => {
  return store.demoCreate.wrapDocumentStatus;
};

export const getIssuedDocumentStatus = (store: RootState): Status => {
  return store.demoCreate.issueDocumentStatus;
};

export const getDocumentPrepared = (store: RootState): { prepared: boolean; error: boolean } => {
  const { createTempDnsStatus, deploymentDocStoreStatus } = store.demoCreate;

  return {
    prepared: createTempDnsStatus === "success" && deploymentDocStoreStatus === "success",
    error: createTempDnsStatus === "failure" || deploymentDocStoreStatus === "failure",
  };
};

export const getDocumentIssued = (store: RootState): { issued: boolean; error: boolean } => {
  const { wrapDocumentStatus, issueDocumentStatus } = store.demoCreate;

  return {
    issued: wrapDocumentStatus === "success" && issueDocumentStatus === "success",
    error: wrapDocumentStatus === "failure" || issueDocumentStatus === "failure",
  };
};

export const {
  resetDemoCreateState,
  deployingDocStore,
  deployDocStoreSuccess,
  deployDocStoreFailure,
  creatingTempDns,
  createTempDnsSuccess,
  createTempDnsFailure,
  wrappingDocument,
  wrapDocumentSuccess,
  wrapDocumentFailure,
  issuingDocument,
  issueDocumentSuccess,
  issueDocumentFailure,
} = demoCreateSlice.actions;

export const demoCreate = demoCreateSlice.reducer;
