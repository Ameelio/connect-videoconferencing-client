import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { cleanCall, CallRO } from "../helpers";
import { createCallOptionsParam, openNotificationWithIcon } from "src/utils";
import {
  BaseCall,
  CallFilters,
  CallMessage,
  CallStatus,
} from "src/typings/Call";

export const callsAdapter = createEntityAdapter<BaseCall>();

export const fetchCalls = createAsyncThunk(
  "calls/fetchAll",
  async (filters: CallFilters) => {
    const body = await fetchAuthenticated(
      `calls?${createCallOptionsParam(filters)}`
    );

    const calls = ((body.data as Record<string, unknown>)
      .results as CallRO[]).map(cleanCall) as BaseCall[];

    return calls;
  }
);

export const updateCallStatus = createAsyncThunk(
  "calls/updateCallStatus",
  async ({
    id,
    status,
    statusDetails,
  }: {
    id: string;
    status: CallStatus;
    statusDetails?: string;
  }) => {
    await fetchAuthenticated(`calls/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, statusDetails }),
    });

    return { id, changes: { status, statusDetails } };
  }
);

export const fetchCallMessages = createAsyncThunk(
  "calls/fetchOne",
  async (id: string) => {
    const body = await fetchAuthenticated(`calls/${id}/callMessages`);
    const messages = body.data as CallMessage[];
    return { id, messages };
  }
);

interface VisitationState extends EntityState<BaseCall> {
  error?: string;
  messages: Record<string, CallMessage[]>;
  loading: boolean;
}

const initialState: VisitationState = callsAdapter.getInitialState({
  messages: {},
  loading: false,
});

export const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{ id: string; message: CallMessage }>
    ) => {
      const { id, message } = action.payload;
      state.messages[id] = [...(state.messages[id] || []), message];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCalls.fulfilled, (state, action) => {
      callsAdapter.upsertMany(state, action.payload);
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(fetchCalls.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
      loading: false,
    }));
    builder.addCase(fetchCalls.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCallMessages.fulfilled, (state, action) => {
      state.messages[action.payload.id] = action.payload.messages;
    });
    builder.addCase(updateCallStatus.fulfilled, (state, action) => {
      callsAdapter.updateOne(state, action.payload);
      const { status } = action.payload.changes;
      openNotificationWithIcon(
        `The call status was updated to ${status}.`,
        "Both parties were notified of the update.",
        "info"
      );
    });
  },
});

export const callsActions = callsSlice.actions;
