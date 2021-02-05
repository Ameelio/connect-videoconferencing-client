import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import camelcaseKeys from "camelcase-keys";
import { AmeelioNode } from "src/typings/Node";
import { showToast } from "src/utils/utils";

export const fetchNodes = createAsyncThunk("node/fetchNodes", async () => {
  const body = await fetchAuthenticated(`/subnodes`, {});

  if (body.status !== 200) {
    throw body;
  }

  const nodes = ((body.data as Record<string, unknown>)
    .subnodes as Object[]).map((inmate) =>
    camelcaseKeys(inmate)
  ) as AmeelioNode[];

  return nodes;
});

export const nodesAdapter = createEntityAdapter<AmeelioNode>();

export const nodesSlice = createSlice({
  name: "nodes",
  initialState: nodesAdapter.getInitialState(),
  reducers: {
    inmatesAddMany: nodesAdapter.addMany,
    inmatesUpdate: nodesAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNodes.fulfilled, (state, action) =>
      nodesAdapter.setAll(state, action.payload)
    );
    builder.addCase(fetchNodes.rejected, (_state, _action) =>
      showToast("nodes", "Could not load facility information", "error")
    );
  },
});

export const inmatesActions = nodesSlice.actions;
