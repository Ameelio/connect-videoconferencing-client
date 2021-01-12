import { UNAUTHENTICATED_USER_ID } from "src/utils/constants";

// Constants & Shapes
const SET_SESSION = "user/SET_SESSION";
const LOGOUT = "user/LOGOUT";

interface SetSessionAction {
  type: typeof SET_SESSION;
  payload: SessionState;
}
interface LogoutAction {
  type: typeof LOGOUT;
}

type UserActionTypes = LogoutAction | SetSessionAction;

export const logout = (): UserActionTypes => {
  return {
    type: LOGOUT,
  };
};

export const setSession = (userState: SessionState): UserActionTypes => {
  return {
    type: SET_SESSION,
    payload: userState,
  };
};

// const fromStorage: string | null = sessionStorage.getItem('userState');
// let storedUserState: SessionState | null = null;
// if (fromStorage) {
//   storedUserState = JSON.parse(fromStorage);
// }

// Reducer
const initialState: SessionState = {
  authInfo: { apiToken: "", rememberToken: "" },
  user: {
    id: UNAUTHENTICATED_USER_ID,
    firstName: "",
    lastName: "",
    email: "",
  },
  isLoggedIn: false,
};

export function sessionReducer(
  state = initialState,
  action: UserActionTypes
): SessionState {
  switch (action.type) {
    case SET_SESSION:
      return action.payload;
    case LOGOUT:
      //   sessionStorage.clear();
      return {
        ...state,
        authInfo: { apiToken: "", rememberToken: "" },
        user: {
          id: UNAUTHENTICATED_USER_ID,
          firstName: "",
          lastName: "",
          email: "",
        },
        isLoggedIn: false,
      };
    default:
      return state;
  }
}
