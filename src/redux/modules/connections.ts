import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import camelcaseKeys from "camelcase-keys";
import { openNotificationWithIcon } from "src/utils/utils";

export const updateConnection = createAsyncThunk(
  "connection/updateConnection",
  async (args: { connectionId: number; status: "approved" | "denied" }) => {
    const body = await fetchAuthenticated("/connection", {
      method: "PUT",
      body: JSON.stringify({
        connection_id: args.connectionId,
        status: args.status,
      }),
    });

    if (body.status !== 200) {
      throw body;
    }

    return args;
  }
);

export const fetchConnections = createAsyncThunk(
  "connection/fetchConnections",
  async () => {
    const body = await fetchAuthenticated(`/connections`);

    if (body.status !== 200 || !body.data) {
      throw body;
    }

    const connections = ((body.data as Record<string, unknown>)
      .connections as Object[]).map((connection) =>
      camelcaseKeys(connection)
    ) as BaseConnection[];

    return connections;
  }
);

export const connectionsAdapter = createEntityAdapter<BaseConnection>();

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: connectionsAdapter.getInitialState(),
  reducers: {
    connectionsAddOne: connectionsAdapter.addOne,
    connectionsAddMany: connectionsAdapter.addMany,
    connectionsUpdate: connectionsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConnections.fulfilled, (state, action) =>
      connectionsAdapter.addMany(state, action.payload)
    );
    builder.addCase(fetchConnections.rejected, (state, action) =>
      console.log(action.error)
    );
    builder.addCase(updateConnection.fulfilled, (state, action) => {
      const { status, connectionId } = action.payload;
      switch (status) {
        case "approved":
          openNotificationWithIcon("Connection created!", "Hooray!", "success");
          break;
        case "denied":
          openNotificationWithIcon("Connection rejected", "Very sad", "info");
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
