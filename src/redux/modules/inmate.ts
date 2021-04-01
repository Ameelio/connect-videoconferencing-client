import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { Inmate } from "src/typings/Inmate";

export const fetchInmates = createAsyncThunk(
  "inmates/fetchInmates",
  async () => {
    const body = await fetchAuthenticated(`inmates`);

    const inmates = (body.data as Record<string, unknown>).results as Inmate[];

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

export const inmatesActions = inmatesSlice.actions;
