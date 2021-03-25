import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import camelcaseKeys from "camelcase-keys";

export const fetchInmates = createAsyncThunk(
  "inmate/fetchInmates",
  async () => {
    const body = await fetchAuthenticated(`/inmates`, {}, false);

    if (body.status !== 200) {
      throw body;
    }

    const inmates = ((body.data as Record<string, unknown>)
      .inmates as Object[]).map((inmate) => camelcaseKeys(inmate)) as Inmate[];

    return inmates;
  }
);

export const updateInmate = createAsyncThunk(
  "inmate/updateInmate",
  async (inmate: Inmate) => {
    await fetchAuthenticated(
      `/inmate/${inmate.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          inmate_number: inmate.inmateNumber,
          first_name: inmate.firstName,
          last_name: inmate.lastName,
          location: inmate.location,
        }),
      },
      false
    );

    return {
      inmateId: inmate.id,
      changes: {
        inmateNumber: inmate.inmateNumber,
        firstName: inmate.firstName,
        lastName: inmate.lastName,
        location: inmate.location,
      },
    };
  }
);

export const inmatesAdapter = createEntityAdapter<Inmate>();

export const inmatesSlice = createSlice({
  name: "inmates",
  initialState: inmatesAdapter.getInitialState(),
  reducers: {
    inmatesAddMany: inmatesAdapter.addMany,
    inmatesUpdate: inmatesAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInmates.fulfilled, (state, action) =>
      inmatesAdapter.setAll(state, action.payload)
    );
    builder.addCase(fetchInmates.rejected, (state, action) =>
      console.log("error")
    );
    builder.addCase(updateInmate.fulfilled, (state, action) =>
      inmatesAdapter.updateOne(state, {
        id: action.payload.inmateId,
        changes: action.payload.changes,
      })
    );
    builder.addCase(updateInmate.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
  },
});

export const inmatesActions = inmatesSlice.actions;
