import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// The magic line

export const connectionsAdapter = createEntityAdapter<BaseConnection>();

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: connectionsAdapter.getInitialState(),
  reducers: {
    connectionsAddOne: connectionsAdapter.addOne,
    connectionsAddMany: connectionsAdapter.addMany,
    connectionsUpdate: connectionsAdapter.updateOne,
    connectionsRemove: connectionsAdapter.removeOne,
  },
});

export const connectionsActions = connectionsSlice.actions;
