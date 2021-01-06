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

export const recordingsAdapter = createEntityAdapter<BaseVisitation>();

export const getRecordings = createAsyncThunk(
  "recordings/fetchAll",
  async (filters: CallFilters) => {
    const body = await fetchAuthenticated(
      url.resolve(API_URL, `node/1/calls?` + createCallOptionsParam(filters))
    );
    if (!body.good) {
      throw body;
    }

    const visitations = ((body.data as Record<string, unknown>)
      .calls as RawVisitation[]).map(cleanVisitation) as RecordedVisitation[];
    //TODO update this with API return when it's actually supported
    // const staff = camelcaseKeys((body.data as Record<string, unknown>)
    // .admin as Object) as Staff;;

    return visitations;
  }
);

interface VisitationState extends EntityState<BaseVisitation> {
  error?: string;
}

const initialState: VisitationState = recordingsAdapter.getInitialState({});

export const recordingsSlice = createSlice({
  name: "recordings",
  initialState,
  reducers: {
    recordingsAddMany: recordingsAdapter.addMany,
    recordingsSetAll: recordingsAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addCase(getRecordings.fulfilled, (state, action) => {
      recordingsAdapter.setAll(state, action.payload);
    });
    builder.addCase(getRecordings.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
  },
});

export const recordingsActions = recordingsSlice.actions;
