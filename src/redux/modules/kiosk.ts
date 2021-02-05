import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { fetchAuthenticated } from "src/api/Common";
import { Kiosk } from "src/typings/Kiosk";
import { SelectedFacility } from "src/typings/Facility";

export const kiosksAdapter = createEntityAdapter<Kiosk>();

export const fetchKiosks = createAsyncThunk("kiosk/fetchKiosks", async () => {
  const body = await fetchAuthenticated(`/kiosks`);

  if (!body.data) {
    throw new Error("Could not load list of facilities");
  }

  const kiosks = camelcaseKeys(
    (body.data as Record<string, unknown>).kiosks as Object
  ) as Kiosk[];

  return kiosks;
});

export const kiosksSlice = createSlice({
  name: "kiosks",
  initialState: kiosksAdapter.getInitialState(),
  reducers: {
    setSelected: (state, action: PayloadAction<SelectedFacility>) => ({
      ...state,
      selected: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchKiosks.fulfilled, (state, action) =>
      kiosksAdapter.setAll(state, action.payload)
    );
    builder.addCase(fetchKiosks.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
  },
});
