import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  EntityState,
} from "@reduxjs/toolkit";
import { API_URL, fetchAuthenticated, toQueryString } from "src/api/Common";
import { AppThunk, cleanVisitation, RawVisitation } from "../helpers";
import url from "url";
import { createCallOptionsParam } from "src/utils/utils";

export const callsAdapter = createEntityAdapter<BaseVisitation>();

export const fetchCalls = createAsyncThunk(
  "calls/fetchAll",
  async (filters: CallFilters) => {
    const body = await fetchAuthenticated(
      `/calls?${createCallOptionsParam(filters)}`
    );
    if (!body.good) {
      throw body;
    }

    const visitations = ((body.data as Record<string, unknown>)
      .calls as RawVisitation[]).map(cleanVisitation) as RecordedVisitation[];

    return visitations;
  }
);

interface VisitationState extends EntityState<BaseVisitation> {
  error?: string;
}

const initialState: VisitationState = callsAdapter.getInitialState({});

export const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    callsAddMany: callsAdapter.addMany,
    callsSetAll: callsAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCalls.fulfilled, (state, action) => {
      // TODO make this a set all and filter
      callsAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchCalls.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
  },
});

export const callsActions = callsSlice.actions;
