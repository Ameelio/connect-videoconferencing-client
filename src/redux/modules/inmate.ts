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

    if (body.status !== 200 || !body.data) {
      throw body;
    }

    const inmates = ((body.data as Record<string, unknown>)
      .inmates as Object[]).map((inmate) => camelcaseKeys(inmate)) as Inmate[];

    return inmates;
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
  },
});

export const updateInmate = createAsyncThunk(
  "inmate/updateInmate",
  async (args: { inmate: Inmate }) => {
    const { inmate } = args;
    await fetchAuthenticated(
      `inmate/${inmate.id}`,
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

    return { inmateId: inmate.id };
  }
);

export const inmatesActions = inmatesSlice.actions;
