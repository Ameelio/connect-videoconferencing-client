import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { openNotificationWithIcon } from "src/utils";
import { BaseConnection, ConnectionStatus } from "src/typings/Connection";

export const updateConnection = createAsyncThunk(
  "connections/updateConnection",
  async (args: {
    connectionId: string;
    status: ConnectionStatus;
    statusDetails?: string;
  }) => {
    await fetchAuthenticated(`connections/${args.connectionId}`, {
      method: "PUT",
      body: JSON.stringify({
        status: args.status,
        statusDetails: args.statusDetails,
      }),
    });

    return args;
  }
);

export const fetchConnections = createAsyncThunk(
  "connections/fetchConnections",
  async () => {
    const body = await fetchAuthenticated(`connections`);

    const connections = (body.data as Record<string, unknown>)
      .results as BaseConnection[];

    return connections;
  }
);

export const connectionsAdapter = createEntityAdapter<BaseConnection>();

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: connectionsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConnections.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchConnections.fulfilled, (state, action) => {
      state.loading = false;
      connectionsAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(fetchConnections.rejected, (state, action) => {
      console.log(action.error.message);
    });
    builder.addCase(updateConnection.fulfilled, (state, action) => {
      const { status, connectionId } = action.payload;
      switch (status) {
        case "active":
          openNotificationWithIcon(
            "Connection was successfully approved.",
            "Both parties were notified of the decision.",
            "success"
          );
          break;
        case "rejected":
          openNotificationWithIcon(
            "Connection request was rejected.",
            "Both parties were notified of the decision.",
            "info"
          );
          break;
      }
      connectionsAdapter.updateOne(state, {
        id: connectionId,
        changes: { status },
      });
    });
    builder.addCase(updateConnection.rejected, (state, action) =>
      console.log(action.error)
    );
  },
});

export const connectionsActions = connectionsSlice.actions;
