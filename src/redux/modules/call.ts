import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { cleanCall, CallRO } from "../helpers";
import { createCallOptionsParam } from "src/utils";
import { BaseCall, CallFilters, CallMessage } from "src/typings/Call";

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

export const fetchCallMessages = createAsyncThunk(
  "calls/fetchOne",
  async (id: number) => {
    const body = await fetchAuthenticated(`calls/${id}/callMessages`);
    const messages = body.data as CallMessage[];
    return { id, changes: { messages } };
  }
);

interface VisitationState extends EntityState<BaseCall> {
  error?: string;
}

const initialState: VisitationState = callsAdapter.getInitialState({});

export const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    callsAddMany: callsAdapter.addMany,
    callsSetAll: callsAdapter.setAll,
    addMessage: (
      state,
      action: PayloadAction<{ id: number; message: CallMessage }>
    ) => {
      const { id, message } = action.payload;
      const call = state.entities[id];
      if (!call) return;
      callsAdapter.updateOne(state, {
        id,
        changes: { messages: [...call.messages, message] },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCalls.fulfilled, (state, action) => {
      callsAdapter.upsertMany(state, action.payload);
      state.error = undefined;
    });
    builder.addCase(fetchCalls.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
    builder.addCase(fetchCallMessages.fulfilled, (state, action) =>
      callsAdapter.updateOne(state, action.payload)
    );
  },
});

export const callsActions = callsSlice.actions;
