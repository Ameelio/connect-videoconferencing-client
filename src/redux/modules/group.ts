import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { Group } from "src/typings/Group";
import { showToast } from "src/utils";

export const fetchGroups = createAsyncThunk("node/fetchGroups", async () => {
  const body = await fetchAuthenticated(`groups`);

  const groups = (body.data as Record<string, unknown>).results;
  return groups as Group[];
});

export const groupsAdapter = createEntityAdapter<Group>();

export const groupsSlice = createSlice({
  name: "groups",
  initialState: groupsAdapter.getInitialState(),
  reducers: {
    inmatesAddMany: groupsAdapter.addMany,
    inmatesUpdate: groupsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.fulfilled, (state, action) =>
      groupsAdapter.setAll(state, action.payload)
    );
    builder.addCase(fetchGroups.rejected, (_state, _action) =>
      showToast("nodes", "Could not load facility information", "error")
    );
  },
});

export const groupsActions = groupsSlice.actions;
