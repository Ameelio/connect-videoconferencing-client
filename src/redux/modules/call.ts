import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { cleanCall, RawCall } from "../helpers";
import { createCallOptionsParam } from "src/utils/Common";
import {
  BaseCall,
  CallFilters,
  CallMessage,
  RecordedCall,
} from "src/typings/Call";

export const callsAdapter = createEntityAdapter<BaseCall>();

export const fetchCalls = createAsyncThunk(
  "calls/fetchAll",
  async (filters: CallFilters) => {
    const body = await fetchAuthenticated(
      `/calls?${createCallOptionsParam(filters)}`
    );
    if (body.status !== 200) {
      throw body;
    }

    const visitations = ((body.data as Record<string, unknown>)
      .calls as RawCall[]).map(cleanCall) as RecordedCall[];

    return visitations;
  }
);

export const fetchRecording = createAsyncThunk(
  "/call/fetchRecording",
  async (callId: number) => {
    const body = await fetchAuthenticated(`/call/${callId}`);
    if (body.status !== 200) {
      throw body;
    }
    const recordingUrl = (body.data as Record<string, unknown>).url as string;
    const messages = (body.data as Record<string, unknown>)
      .messages as CallMessage[];

    return { callId, recordingUrl, messages };
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
    replaceMessages: {
      reducer(
        state,
        action: PayloadAction<{ id: number; messages: CallMessage[] }>
      ) {
        const { id, messages } = action.payload;
        callsAdapter.updateOne(state, {
          id: id,
          changes: {
            messages: messages,
          },
        });
      },
      prepare(id: number, messages: CallMessage[]) {
        return { payload: { id, messages } };
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCalls.fulfilled, (state, action) => {
      // TODO make this a set all and filter
      // callsAdapter.addMany(state, action.payload);
      callsAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(fetchCalls.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
    builder.addCase(fetchRecording.fulfilled, (state, action) =>
      callsAdapter.updateOne(state, {
        id: action.payload.callId,
        changes: {
          recordingUrl: action.payload.recordingUrl,
          messages: action.payload.messages,
        },
      })
    );
    builder.addCase(fetchRecording.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
  },
});

export const callsActions = callsSlice.actions;
