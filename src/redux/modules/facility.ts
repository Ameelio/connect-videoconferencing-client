import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { API_URL, fetchAuthenticated } from "src/api/Common";
import { Kiosk } from "src/typings/Kiosk";
import { SelectedFacility, Facility, NodeCallSlot } from "src/typings/Facility";
import { mapCallBlockToCallSlots } from "src/utils/Call";
import url from "url";
import { Store } from "..";

export const facilitiesAdapter = createEntityAdapter<Facility>();

export const selectActiveFacility = createAsyncThunk(
  "facility/selectActiveFacility",
  async (facility: Facility) => {
    // need to harcode the nodeId for initialization,
    const bodyCt = await fetchAuthenticated(
      `node/${facility.nodeId}/times`,
      {},
      false
    );

    if (!bodyCt.data) throw new Error("Could not load facility data");

    const callTimes = camelcaseKeys(
      (bodyCt.data as Record<string, unknown>).call_times as Object
    ) as NodeCallSlot[];

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
  async (args: { callSlots: NodeCallSlot[]; zone: string }) => {
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
    builder.addCase(selectActiveFacility.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(updateCallTimes.fulfilled, (state, action) => ({
      ...state,
      // TODO update store with new call times
      // selected:  {...state.selected},
      // selected: { ...state.selected, callTimes: action.payload },
    }));
  },
});

export const facilitiesActions = facilitiesSlice.actions;
