import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { getStaff } from "src/api/Persona";
import { getVisitations } from "src/api/Visitation";
import { AppThunk } from "../helpers";

export const staffAdapter = createEntityAdapter<Staff>();

export const staffSlice = createSlice({
  name: "staff",
  initialState: staffAdapter.getInitialState(),
  reducers: {
    staffSetAll: staffAdapter.setAll,
    staffUpdateOne: staffAdapter.updateOne,
  },
});

export const staffActions = staffSlice.actions;

// export const getRecordings = (query="", dateRange?: Date[], duration?: number[], limit=100, offset=0,
//   ): AppThunk => async (dispatch) => {
//     // TODO wrap in try catch
//     const recordings =  await getVisitations(dateRange, query, duration, true, limit, offset);
//     console.log('number of recodings returned:' + recordings.length);
//     dispatch(recordingsActions.recordingsSetAll(recordings));
// };

export const loadStaff = (): AppThunk => async (dispatch) => {
  const staff = await getStaff();
  dispatch(staffActions.staffSetAll(staff));
};
