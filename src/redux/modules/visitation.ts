import { AppThunk } from "src/redux/helpers";
import { LIVE_VISITATIONS, SCHEDULED_VISITATIONS } from "src/data/sample";

const SET_LIVE_VISITATIONS = "visitation/SET_LIVE_VISITATIONS";
const SELECT_LIVE_VISITATION = "visitation/SELECT_LIVE_VISITATION";
const SET_SCHEDULED_VISITATIONS = "visitation/SET_SCHEDULED_VISITATIONS";

// Action Constants & Shapes
interface SetLiveVisitationAction {
  type: typeof SET_LIVE_VISITATIONS;
  payload: LiveVisitation[];
}

interface SelectLivitationAction {
  type: typeof SELECT_LIVE_VISITATION;
  payload: LiveVisitation;
}

interface SetScheduledVisitations {
  type: typeof SET_SCHEDULED_VISITATIONS;
  payload: Visitation[];
}

type LiveVisitationActionTypes =
  | SetLiveVisitationAction
  | SelectLivitationAction
  | SetScheduledVisitations;

// Action Creators
const setLiveVisitations = (
  visitations: LiveVisitation[]
): LiveVisitationActionTypes => {
  return {
    type: SET_LIVE_VISITATIONS,
    payload: visitations,
  };
};

export const selectLiveVisitation = (
  visitation: LiveVisitation
): LiveVisitationActionTypes => {
  return {
    type: SELECT_LIVE_VISITATION,
    payload: visitation,
  };
};

const setScheduledVisitations = (
  visitations: Visitation[]
): LiveVisitationActionTypes => {
  return {
    type: SET_SCHEDULED_VISITATIONS,
    payload: visitations,
  };
};

// Reducer
const initialState: VisitationState = {
  liveVisitations: [],
  selectedVisitation: null,
  scheduledVisitations: [],
  hasLoaded: false,
  hasLoadedScheduledVisitations: false,
};

export function visitationsReducer(
  state = initialState,
  action: LiveVisitationActionTypes
): VisitationState {
  switch (action.type) {
    case SET_LIVE_VISITATIONS:
      const selectedVisitation = action.payload.length
        ? action.payload[0]
        : null;
      return {
        ...state,
        liveVisitations: action.payload,
        selectedVisitation: selectedVisitation, //TODO this assumes that there is at least one live visitation. This will break for zero state
        hasLoaded: true,
      };
    case SELECT_LIVE_VISITATION:
      return { ...state, selectedVisitation: action.payload };
    case SET_SCHEDULED_VISITATIONS:
      return {
        ...state,
        scheduledVisitations: action.payload,
        hasLoadedScheduledVisitations: true,
      };
    default:
      return state;
  }
}

export const loadLiveVisitations = (): AppThunk => async (dispatch) => {
  dispatch(setLiveVisitations(LIVE_VISITATIONS));
};

export const loadScheduledVisitations = (): AppThunk => async (dispatch) => {
  dispatch(setScheduledVisitations(SCHEDULED_VISITATIONS));
};
