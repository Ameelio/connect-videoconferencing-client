import { AppThunk } from "src/redux/helpers";

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
  payload: BaseVisitation[];
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
export const setLiveVisitations = (
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

export const setScheduledVisitations = (
  visitations: BaseVisitation[]
): LiveVisitationActionTypes => {
  return {
    type: SET_SCHEDULED_VISITATIONS,
    payload: visitations,
  };
};

export const setPastVisitations = (
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
const initialVisitationState: VisitationState = {
  liveVisitations: [],
  selectedVisitation: null,
  scheduledVisitations: [],
  hasLoaded: false,
  hasLoadedScheduledVisitations: false,
  pastVisitations: [],
  selectedPastVisitation: null,
};

export function visitationsReducer(
  state = initialVisitationState,
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
