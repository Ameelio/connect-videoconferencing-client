import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { AmeelioNode } from "src/typings/Node";
import { UI } from "src/utils";

export const fetchNodes = createAsyncThunk("node/fetchNodes", async () => {
  console.log("before fetchnodes");
  const body = await fetchAuthenticated(`/subnodes`, {
    method: "POST",
    body: JSON.stringify({
      recursive: true,
    }),
  });

  if (body.status !== 200) {
    throw body;
  }

  const nodes = (body.data as Record<string, unknown>).subnodes;

  return [nodes] as AmeelioNode[];
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
      UI.showToast("nodes", "Could not load facility information", "error")
    );
  },
});

export const inmatesActions = nodesSlice.actions;
