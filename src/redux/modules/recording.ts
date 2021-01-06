import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { getVisitations } from "src/api/Visitation";
import { AppThunk } from "../helpers";

export const recordingsAdapter = createEntityAdapter<BaseVisitation>();

export const recordingsSlice = createSlice({
  name: "recordings",
  initialState: recordingsAdapter.getInitialState(),
  reducers: {
    recordingsAddMany: recordingsAdapter.addMany,
    recordingsSetAll: recordingsAdapter.setAll,
  },
});

export const recordingsActions = recordingsSlice.actions;

export const getRecordings = (
  query = "",
  startDate?: Date,
  endDate?: Date,
  duration?: number[],
  limit = 100,
  offset = 0
): AppThunk => async (dispatch) => {
  // TODO wrap in try catch
  const recordings = await getVisitations(
    startDate,
    endDate,
    query,
    duration,
    true,
    limit,
    offset
  );
  console.log("number of recodings returned:" + recordings.length);
  dispatch(recordingsActions.recordingsSetAll(recordings));
};
