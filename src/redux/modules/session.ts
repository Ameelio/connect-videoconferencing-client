import { User } from "src/typings/Session";
import { UNAUTHENTICATED_USER_ID } from "src/utils/constants";

interface SessionState {
  isLoggedIn: boolean;
  user: User;
  redirectUrl: string;
}

// Constants & Shapes
const SET_SESSION = "user/SET_SESSION";
const SET_REDIRECT_URL = "user/SET_REDIRECT_URL";
const LOGOUT = "user/LOGOUT";

interface SetSessionAction {
  type: typeof SET_SESSION;
  payload: User;
}
interface LogoutAction {
  type: typeof LOGOUT;
}

interface SetRedirectUrl {
  type: typeof SET_REDIRECT_URL;
  payload: string;
}

type UserActionTypes = LogoutAction | SetSessionAction | SetRedirectUrl;

export const logout = (): UserActionTypes => {
  return {
    type: LOGOUT,
  };
};

export const setSession = (user: User): UserActionTypes => {
  return {
    type: SET_SESSION,
    payload: user,
  };
};

export const setRedirectUrl = (url: string): UserActionTypes => {
  return {
    type: SET_REDIRECT_URL,
    payload: url,
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
  redirectUrl: "/",
};

export function sessionReducer(
  state = initialState,
  action: UserActionTypes
): SessionState {
  switch (action.type) {
    case SET_SESSION:
      return { ...state, user: action.payload, isLoggedIn: true };
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
        redirectUrl: "/",
      };
    case SET_REDIRECT_URL:
      return { ...state, redirectUrl: action.payload };
    default:
      return state;
  }
}
