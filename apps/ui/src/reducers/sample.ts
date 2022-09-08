import { createSlice } from "@reduxjs/toolkit";

const sampleSlice = createSlice({
  name: "sample",
  initialState: {
    isSampleDocument: false,
  },
  reducers: {
    setActive: (state) => {
      state.isSampleDocument = true;
    },
    reset: (state) => {
      state.isSampleDocument = false;
    },
  },
});

export const { setActive, reset } = sampleSlice.actions;
export const sample = sampleSlice.reducer; // abit overkill to use reducer, but don't feel like props drilling
