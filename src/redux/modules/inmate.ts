import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

export const inmatesAdapter = createEntityAdapter<Inmate>();

export const inmatesSlice = createSlice({
  name: "inmates",
  initialState: inmatesAdapter.getInitialState(),
  reducers: {
    inmatesAddMany: inmatesAdapter.addMany,
    inmatesUpdate: inmatesAdapter.updateOne,
    // selectInmate: (state, action: PayloadAction<Inmate>) => action.payload,
  },
});

export const inmatesActions = inmatesSlice.actions;
