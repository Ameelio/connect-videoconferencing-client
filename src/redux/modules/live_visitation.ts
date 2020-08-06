import { AppThunk } from "src/redux/helpers";
import { LIVE_VISITATIONS } from "src/data/sample";

const SET_LIVE_VISITATION = "liveVisitation/SET_LIVE_VISITATION";
const SELECT_LIVE_VISITATION = "liveVisitation/SELECT_LIVE_VISITATION";

// Action Constants & Shapes
interface SetLiveVisitationAction {
  type: typeof SET_LIVE_VISITATION;
  payload: LiveVisitation[];
}

interface SelectLivitationAction {
  type: typeof SELECT_LIVE_VISITATION;
  payload: LiveVisitation;
}

type LiveVisitationActionTypes =
  | SetLiveVisitationAction
  | SelectLivitationAction;

// Action Creators
const setLiveVisitations = (
  visitations: LiveVisitation[]
): LiveVisitationActionTypes => {
  return {
    type: SET_LIVE_VISITATION,
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

// Reducer
const initialState: LiveVisitationState = {
  visitations: [],
  hasLoaded: false,
};

export function liveVisitationsReducer(
  state = initialState,
  action: LiveVisitationActionTypes
): LiveVisitationState {
  switch (action.type) {
    case SET_LIVE_VISITATION:
      return {
        ...state,
        visitations: action.payload,
        selectedVisitation: action.payload[0],
        hasLoaded: true,
      };
    case SELECT_LIVE_VISITATION:
      return { ...state, selectedVisitation: action.payload };
    default:
      return state;
  }
}

export const loadLiveVisitations = (): AppThunk => async (dispatch) => {
  dispatch(setLiveVisitations(LIVE_VISITATIONS));
};
