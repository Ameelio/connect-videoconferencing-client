import { AppThunk } from "src/redux/helpers";
import {
  LIVE_VISITATIONS,
  SCHEDULED_VISITATIONS,
  PAST_VISITATIONS,
} from "src/data/sample";
import { getVisitations } from "src/api/Visitation";

const SET_LIVE_VISITATIONS = "visitation/SET_LIVE_VISITATIONS";
const SELECT_LIVE_VISITATION = "visitation/SELECT_LIVE_VISITATION";
const DELETE_LIVE_VISITATION = "visitation/DELETE_LIVE_VISITATION";
const SET_SCHEDULED_VISITATIONS = "visitation/SET_SCHEDULED_VISITATIONS";
const SET_PAST_VISITATIONS = "visitation/SET_PASET_PAST_VISITATIONS";
const SELECT_PAST_VISITATION = "visitation/SELECT_PAST_VISITATION";
const ADD_VIDEO_RECORDING = "visitation/ADD_VIDEO_RECORDING";
// Action Constants & Shapes
interface SetLiveVisitationAction {
  type: typeof SET_LIVE_VISITATIONS;
  payload: LiveVisitation[];
}

interface SelectLivitationAction {
  type: typeof SELECT_LIVE_VISITATION;
  payload: LiveVisitation;
}

interface DeleteLiveVisitationAction {
  type: typeof DELETE_LIVE_VISITATION;
  payload: LiveVisitation;
}

interface SetScheduledVisitationsAction {
  type: typeof SET_SCHEDULED_VISITATIONS;
  payload: Visitation[];
}

interface SetPastVisitationsAction {
  type: typeof SET_PAST_VISITATIONS;
  payload: RecordedVisitation[];
}

interface SelectVisitationsAction {
  type: typeof SELECT_PAST_VISITATION;
  payload: RecordedVisitation;
}

interface RecordingKeyValue {
  id: number;
  value: string;
}
interface AddRecordingAction {
  type: typeof ADD_VIDEO_RECORDING;
  payload: RecordingKeyValue;
}

type LiveVisitationActionTypes =
  | SetLiveVisitationAction
  | SelectLivitationAction
  | DeleteLiveVisitationAction
  | SetScheduledVisitationsAction
  | SetPastVisitationsAction
  | SelectVisitationsAction
  | AddRecordingAction;

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

const deleteLiveVisitation = (
  visitation: LiveVisitation
): LiveVisitationActionTypes => {
  return {
    type: DELETE_LIVE_VISITATION,
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

const setPastVisitations = (
  visitations: RecordedVisitation[]
): LiveVisitationActionTypes => {
  return {
    type: SET_PAST_VISITATIONS,
    payload: visitations,
  };
};

export const selectPastVisitation = (
  visitation: RecordedVisitation
): LiveVisitationActionTypes => {
  return {
    type: SELECT_PAST_VISITATION,
    payload: visitation,
  };
};

const addRecording = (id: number, value: string) => {
  return {
    type: ADD_VIDEO_RECORDING,
    payload: { id: id, value: value },
  };
};

// Reducer
const initialState: VisitationState = {
  liveVisitations: [],
  selectedVisitation: null,
  scheduledVisitations: [],
  hasLoaded: false,
  hasLoadedScheduledVisitations: false,
  pastVisitations: [],
  selectedPastVisitation: null,
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
    case DELETE_LIVE_VISITATION:
      const liveVisitationsPostDeletion = state.liveVisitations.filter(
        (visitation) => visitation.id !== action.payload.id
      );

      return {
        ...state,
        liveVisitations: liveVisitationsPostDeletion,
        selectedVisitation: liveVisitationsPostDeletion.length
          ? liveVisitationsPostDeletion[0]
          : null,
      };
    case SET_SCHEDULED_VISITATIONS:
      return {
        ...state,
        scheduledVisitations: action.payload,
        hasLoadedScheduledVisitations: true,
      };
    case SET_PAST_VISITATIONS:
      const selectedPastVisitation = action.payload.length
        ? action.payload[0]
        : null;
      return {
        ...state,
        pastVisitations: action.payload,
        selectedPastVisitation: selectedPastVisitation,
      };
    case SELECT_PAST_VISITATION:
      return {
        ...state,
        selectedPastVisitation: action.payload,
      };
    case ADD_VIDEO_RECORDING:
      const foundIndex = state.pastVisitations.findIndex(
        (visitation) => visitation.id === action.payload.id
      );
      // state.pastVisitations[foundIndex].recordingUrl = action.payload.value;

      return {
        ...state,
      };
    default:
      return state;
  }
}

//TODO replace these with real API calls
export const loadLiveVisitations = (): AppThunk => async (dispatch) => {
  dispatch(setLiveVisitations(LIVE_VISITATIONS));
};

export const loadScheduledVisitations = (): AppThunk => async (dispatch) => {
  const visitations = await getVisitations({
    date: [
      new Date(),
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    ],
    approved: true,
  });
  dispatch(setScheduledVisitations(visitations));
};

export const loadPastVisitations = (): AppThunk => async (dispatch) => {
  dispatch(setPastVisitations(PAST_VISITATIONS));
};

export const terminateLiveVisitation = (
  visitation: LiveVisitation
): AppThunk => async (dispatch) => {
  dispatch(deleteLiveVisitation(visitation));
};

export const fetchVideoRecording = (
  visitation: RecordedVisitation
): AppThunk => async (dispatch) => {
  const { id } = visitation;
  dispatch(addRecording(id, process.env.PUBLIC_URL + "/recording_demo.mp4"));
};