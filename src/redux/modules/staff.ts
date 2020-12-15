const SET_STAFF = "staff/SET_STAFF";
const SELECT_STAFF = "staff/SELECT_STAFF";

interface SetStaffAction {
  type: typeof SET_STAFF;
  payload: Staff[];
}

interface SelectStaffAction {
  type: typeof SELECT_STAFF;
  payload: Staff;
}

type StaffActionTypes = SetStaffAction | SelectStaffAction;

// Action Creators
export const setStaff = (staff: Staff[]): StaffActionTypes => {
  return {
    type: SET_STAFF,
    payload: staff,
  };
};

export const selectStaff = (member: Staff): StaffActionTypes => {
  return {
    type: SELECT_STAFF,
    payload: member,
  };
};

const initialState: StaffState = {
  staff: [],
  selectedStaff: null,
};

export function staffReducer(
  state = initialState,
  action: StaffActionTypes
): StaffState {
  switch (action.type) {
    case SET_STAFF:
      const selectedStaff = action.payload.length ? action.payload[0] : null;

      return { ...state, staff: action.payload, selectedStaff: selectedStaff };
    case SELECT_STAFF:
      return { ...state, selectedStaff: action.payload };
    default:
      return state;
  }
}
