import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { DataNode } from "rc-tree/lib/interface";
import { fetchAuthenticated } from "src/api/Common";
import { GroupRO } from "src/typings/Group";
import { showToast } from "src/utils";

const cleanTree = (group: GroupRO): DataNode => {
  const { id, name, children } = group;

  return {
    title: name,
    key: id,
    children: children.length ? children.map((child) => cleanTree(child)) : [],
  };
};

export const fetchGroups = createAsyncThunk("node/fetchGroups", async () => {
  const body = await fetchAuthenticated(`groups`);

  const groupTrees = (body.data as any) as GroupRO[];

  const nodes = groupTrees.map((tree) => cleanTree(tree));

  return nodes;
});

interface GroupState {
  nodes: DataNode[];
}

const initialState: GroupState = { nodes: [] };
export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.fulfilled, (state, action) => ({
      ...state,
      nodes: action.payload,
    }));
    builder.addCase(fetchGroups.rejected, (_state, _action) =>
      showToast("nodes", "Could not load facility information", "error")
    );
  },
});
