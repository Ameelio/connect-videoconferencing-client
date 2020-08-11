import { AppThunk } from "src/redux/helpers";
import { INMATES } from "src/data/sample";

const SET_INMATES = "inmate/SET_INMATES";
const SELECT_INMATE = "inmate/SELECT_INMATE";

// Action Constants & Shapes
interface SetInmatesAction {
  type: typeof SET_INMATES;
  payload: Inmate[];
}

interface SelectInmateAction {
  type: typeof SELECT_INMATE;
  payload: Inmate;
}

type InmateActionTypes = SetInmatesAction | SelectInmateAction;

// Action Creators
const setInmates = (inmates: Inmate[]): InmateActionTypes => {
  return {
    type: SET_INMATES,
    payload: inmates,
  };
};

export const selectInmate = (inmate: Inmate): InmateActionTypes => {
  return {
    type: SELECT_INMATE,
    payload: inmate,
  };
};

// Reducer
const initialState: InmateState = {
  inmates: [],
  selectedInmate: null,
};

export function inmatesReducer(
  state = initialState,
  action: InmateActionTypes
): InmateState {
  switch (action.type) {
    case SET_INMATES:
      const selectedInmate = action.payload.length ? action.payload[0] : null;
      return {
        ...state,
        inmates: action.payload,
        selectedInmate: selectedInmate,
      };
    case SELECT_INMATE:
      return { ...state, selectedInmate: action.payload };
    default:
      return state;
  }
}

export const loadInmates = (): AppThunk => async (dispatch) => {
  dispatch(setInmates(INMATES));
};
