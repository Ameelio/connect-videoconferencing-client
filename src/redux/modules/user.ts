// Constants & Shapes
const LOGIN = "user/LOGIN";
const LOGOUT = "user/LOGOUT";

interface LoginAction {
  type: typeof LOGIN;
  payload: Staff;
}

interface LogoutAction {
  type: typeof LOGOUT;
  //   payload: null;
}

type SessionActionTypes = LoginAction | LogoutAction;

// Action Creators
export const login = (staff: Staff): SessionActionTypes => {
  return {
    type: LOGIN,
    payload: staff,
  };
};

export const logout = (): SessionActionTypes => {
  return {
    type: LOGOUT,
    // payload: null,
  };
};

// const fromStorage: string | null = sessionStorage.getItem('userState');
// let storedUserState: UserState | null = null;
// if (fromStorage) {
//   storedUserState = JSON.parse(fromStorage);
// }

// Reducer
// let initialState: UserState = storedUserState || {
//   user: null,
//   token: null,
// };

let initialState: SessionState = {
  staff: null,
  token: null,
};

export function sessionReducer(
  state = initialState,
  action: SessionActionTypes
): SessionState {
  switch (action.type) {
    case LOGIN:
      return { ...state, staff: action.payload };
    case LOGOUT:
      //   sessionStorage.clear();
      return {
        ...state,
        staff: null,
        token: null,
      };
    default:
      return state;
  }
}
