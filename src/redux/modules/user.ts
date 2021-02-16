import { User } from "src/typings/Session";
import { UNAUTHENTICATED_USER_ID } from "src/utils/constants";

interface SessionState {
  isLoggedIn: boolean;
  user: User;
}

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

// Reducer
const initialState: SessionState = {
  user: {
    id: UNAUTHENTICATED_USER_ID,
    firstName: "",
    lastName: "",
    email: "",
    token: "",
    remember: "",
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
        user: {
          id: UNAUTHENTICATED_USER_ID,
          firstName: "",
          lastName: "",
          email: "",
          token: "",
          remember: "",
        },
        isLoggedIn: false,
      };
    default:
      return state;
  }
}
