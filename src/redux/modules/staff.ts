import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  EntityState,
} from "@reduxjs/toolkit";
import { API_URL, fetchAuthenticated } from "src/api/Common";
import { getStaff } from "src/api/Persona";
import { AppThunk } from "../helpers";
import url from "url";
import camelcaseKeys from "camelcase-keys";

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

export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async (args: { email: string; role: string; permissions: Permission[] }) => {
    const body = await fetchAuthenticated(
      url.resolve(API_URL, `node/1/admin`),
      {
        method: "POST",
        body: JSON.stringify({
          email: args.email,
          role: args.role,
          permissions: args.permissions,
        }),
      }
    );

    //TODO update this with API return when it's actually supported
    const staff = camelcaseKeys(
      (body.data as Record<string, unknown>).staff as Object
    ) as Staff;

    return staff;
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
    builder.addCase(createStaff.fulfilled, (state, action) => {
      staffAdapter.addOne(state, action.payload);
    });
    builder.addCase(createStaff.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
  },
});

export const staffActions = staffSlice.actions;

export const loadStaff = (): AppThunk => async (dispatch) => {
  // TODO move this to async thunk
  const staff = await getStaff();
  dispatch(staffActions.staffSetAll(staff));
};
