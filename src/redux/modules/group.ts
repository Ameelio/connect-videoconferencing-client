import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { DataNode } from "rc-tree/lib/interface";
import { fetchAuthenticated } from "src/api/Common";
import { Group, GroupDataNode } from "src/typings/Group";
import { showToast } from "src/utils";

const cleanTree = (group: GroupDataNode): DataNode => {
  const { id, name, children } = group;

  group.children.sort((a, b) => (a.name > b.name ? 1 : -1));

  return {
    title: name,
    key: id,
    children: children.length ? children.map((child) => cleanTree(child)) : [],
  };
};

export const fetchGroups = createAsyncThunk("node/fetchGroups", async () => {
  const body = await fetchAuthenticated(`groups`);

  let groupTrees = (body.data as any).tree as GroupDataNode[];
  const groups = (body.data as any).groups as GroupDataNode[];
  groupTrees.sort((a, b) => (a.name > b.name ? 1 : -1));
  groupTrees = groupTrees.filter(
    (groupTree) => groupTree.name !== "pod 1" && groupTree.name !== "pod 2"
  );

  const nodes = groupTrees.map((tree) => cleanTree(tree));

  return { nodes, groups };
});

export const groupsAdapter = createEntityAdapter<Group>();

interface GroupState extends EntityState<Group> {
  nodes: DataNode[];
}

const initialState: GroupState = groupsAdapter.getInitialState({ nodes: [] });
export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      groupsAdapter.setAll(state, action.payload.groups);
      state.nodes = action.payload.nodes;
    });
    builder.addCase(fetchGroups.rejected, (_state, _action) =>
      showToast("nodes", "Could not load facility information", "error")
    );
  },
});
