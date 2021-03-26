import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { fetchAuthenticated } from "src/api/Common";
import { SelectedFacility, Facility, CallSlot } from "src/typings/Facility";
import { showToast } from "src/utils";
import { Store } from "..";

export const facilitiesAdapter = createEntityAdapter<Facility>();

export const selectActiveFacility = createAsyncThunk(
  "facility/selectActiveFacility",
  async (facility: Facility) => {
    // need to harcode the nodeId for initialization,
    const bodyCt = await fetchAuthenticated(
      `facilities/${facility.id}/callSlots`,
      {},
      false
    );

    const callTimes = (bodyCt.data as Record<string, unknown>)
      .results as CallSlot[];

    return { ...facility, callTimes };
  }
);

export const fetchFacilities = createAsyncThunk(
  "facility/fetchFacilities",
  async () => {
    // TODO refactor this to use some APIServiceManager
    const fBody = await fetchAuthenticated(
      `users/${Store.getState().session.user.id}/facilities`,
      {},
      false
    );

    const facilities = fBody.data as Facility[];

    if (!facilities.length) {
      throw new Error("Must have access to at least one facility");
    }

    // fetch information for first facility
    Store.dispatch(selectActiveFacility(facilities[0]));

    return { facilities };
  }
);

const UPDATE_CALL_HOURS = "facility/updateCallTimes";
export const updateCallTimes = createAsyncThunk(
  UPDATE_CALL_HOURS,
  async (args: { callSlots: CallSlot[]; zone: string }) => {
    const body = await fetchAuthenticated(`/times`, {
      method: "PUT",
      body: JSON.stringify({
        call_times: args.callSlots,
        zone: "America_LosAngeles",
      }),
    });

    // update
    if (!body.data) {
      throw new Error("Could not update call time");
    }

    // update stsore
    return args.callSlots;
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFacilities.fulfilled, (state, action) => {
      const newState = facilitiesAdapter.setAll(
        state,
        action.payload.facilities
      );
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
    builder.addCase(selectActiveFacility.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(updateCallTimes.pending, (state, action) => {
      showToast(UPDATE_CALL_HOURS, "Processing request...", "loading");
    });
    builder.addCase(updateCallTimes.fulfilled, (state, action) => {
      showToast(
        UPDATE_CALL_HOURS,
        "Succesfully updated the settings!",
        "success"
      );
      if (!state.selected) return { ...state };
      return {
        ...state,
        selected: { ...state.selected, callTimes: action.payload },
      };
    });
    builder.addCase(updateCallTimes.rejected, (state, action) => {
      showToast(UPDATE_CALL_HOURS, "Failed to update.", "success");
    });
  },
});

export const facilitiesActions = facilitiesSlice.actions;
