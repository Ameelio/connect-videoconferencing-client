import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  EntityState,
} from "@reduxjs/toolkit";
import { API_URL, fetchAuthenticated } from "src/api/Common";
import { getStaff, postStaffMember } from "src/api/Persona";
import { getVisitations } from "src/api/Visitation";
import UserDetailsCard from "src/components/cards/UserDetailsCard";
import { AppThunk } from "../helpers";
import url from "url";

export const staffAdapter = createEntityAdapter<Staff>();

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async (args: { userId: number; permissions: Permission[] }) => {
    const body = await fetchAuthenticated(
      url.resolve(API_URL, `node/1/admin`),
      {
        method: "POST",
        body: JSON.stringify({
          user_id: args.userId,
          permissions: args.permissions,
        }),
      }
    );

    //TODO update this with API return when it's actually supported
    // const staff = camelcaseKeys((body.data as Record<string, unknown>)
    // .admin as Object) as Staff;;

    return { userId: args.userId, changes: { permissions: args.permissions } };
  }
);

interface StaffState extends EntityState<Staff> {
  error?: string;
}

const initialState: StaffState = staffAdapter.getInitialState({
  loading: false,
});

export const staffSlice = createSlice({
  name: "staff",
  initialState: initialState,
  reducers: {
    staffSetAll: staffAdapter.setAll,
    staffUpdateOne: staffAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(updateStaff.fulfilled, (state, action) => {
      staffAdapter.updateOne(state, {
        id: action.payload.userId,
        changes: action.payload.changes,
      });
    });
    builder.addCase(updateStaff.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
  },
});

export const staffActions = staffSlice.actions;

export const loadStaff = (): AppThunk => async (dispatch) => {
  const staff = await getStaff();
  dispatch(staffActions.staffSetAll(staff));
};
