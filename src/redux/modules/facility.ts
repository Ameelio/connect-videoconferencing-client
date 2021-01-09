import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { API_URL, fetchAuthenticated } from "src/api/Common";
import { SelectedFacility, Facility, NodeCallTimes } from "src/typings/Node";
import url from "url";
import { Store } from "..";

export const facilitiesAdapter = createEntityAdapter<Facility>();

export const selectActiveFacility = createAsyncThunk(
  "facility/selectActiveFacility",
  async (facility: Facility) => {
    const body = await fetchAuthenticated(
      `node/${facility.nodeId}/times`,
      {},
      false
    );

    console.log(body);
    if (!body.data) {
      throw new Error("Could not load facility data");
    }

    const callTimes = camelcaseKeys(
      (body.data as Record<string, unknown>).call_times as Object
    ) as NodeCallTimes[];

    return { ...facility, callTimes };
  }
);

export const fetchFacilities = createAsyncThunk(
  "facility/fetchFacilities",
  async () => {
    // TODO refactor this to use some APIServiceManager
    const fBody = await fetchAuthenticated(
      `user/${Store.getState().session.user.id}/facilities`,
      {},
      false
    );

    if (!fBody.data) {
      throw new Error("Could not load list of facilities");
    }

    const facilities = camelcaseKeys(
      (fBody.data as Record<string, unknown>) as Object
    ) as Facility[];

    if (!facilities.length) {
      throw new Error("Must have access to at least one facility");
    }

    // fetch information for first facility
    Store.dispatch(selectActiveFacility(facilities[0]));

    return { facilities };
  }
);

export const updateCallTimes = createAsyncThunk(
  "facility/updateCallTimes",
  async (args: { callTimes: NodeCallTimes }) => {
    const fBody = await fetchAuthenticated(
      url.resolve(
        API_URL,
        `/api/user/${Store.getState().session.user.id}/facilities`
      )
    );

    // update

    // update stsore
  }
);

interface FacilitiesState extends EntityState<Facility> {
  error?: string;
  selected?: SelectedFacility;
  loading: boolean;
}

const initialState: FacilitiesState = facilitiesAdapter.getInitialState({
  loading: false,
});

export const facilitiesSlice = createSlice({
  name: "facilities",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<SelectedFacility>) => ({
      ...state,
      selected: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFacilities.fulfilled, (state, action) => {
      const newState = facilitiesAdapter.setAll(
        state,
        action.payload.facilities
      );
      // console.log( action.payload.selected);
      // newState.selected = action.payload.selected;
      return newState;
    });
    builder.addCase(fetchFacilities.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
    }));
    builder.addCase(selectActiveFacility.fulfilled, (state, action) => ({
      ...state,
      selected: action.payload,
      loading: false,
    }));
    builder.addCase(selectActiveFacility.rejected, (state, action) => ({
      ...state,
      error: action.error.message,
      loading: false,
    }));
    builder.addCase(selectActiveFacility.pending, (state, action) => ({
      ...state,
      loading: true,
    }));
  },
});
