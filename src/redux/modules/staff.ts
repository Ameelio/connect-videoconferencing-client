import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  EntityState,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";

export const staffAdapter = createEntityAdapter<Staff>();

export const fetchStaff = createAsyncThunk("staff/fetchStaff", async () => {
  const body = await fetchAuthenticated(`staffMembers`);

  const staff = (body.data as Record<string, unknown>).results as Staff[];

  return staff;
});

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async (args: { userId: string; permissions: Permission[] }) => {
    const body = await fetchAuthenticated("/admin", {
      method: "POST",
      body: JSON.stringify({
        user_id: args.userId,
        permissions: args.permissions,
      }),
    });

    if (body.status !== 200)
      throw new Error("Failed to update staff member information");

    return { userId: args.userId, changes: { permissions: args.permissions } };
  }
);

export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async (args: { email: string; role: string; permissions: Permission[] }) => {
    const body = await fetchAuthenticated(`/admin`, {
      method: "POST",
      body: JSON.stringify({
        email: args.email,
        role: args.role,
        permissions: args.permissions,
      }),
    });
    const staff = body.data as Staff;

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
    builder.addCase(fetchStaff.fulfilled, (state, action) =>
      staffAdapter.addMany(state, action.payload)
    );
    builder.addCase(fetchStaff.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
    builder.addCase(updateStaff.fulfilled, (state, action) =>
      staffAdapter.updateOne(state, {
        id: action.payload.userId,
        changes: action.payload.changes,
      })
    );
    builder.addCase(updateStaff.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
    builder.addCase(createStaff.fulfilled, (state, action) =>
      staffAdapter.addOne(state, action.payload)
    );
    builder.addCase(createStaff.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
  },
});

export const staffActions = staffSlice.actions;
