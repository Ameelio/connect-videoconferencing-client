import { User } from "src/typings/Session";
import { UNAUTHENTICATED_USER_ID } from "src/utils/constants";

// TODO migrate this to redux slice
// @gabe: I attempted the migraton, but it's creating some wild circular dependeies
interface SessionState {
  status: "inactive" | "active" | "loading";
  user: User;
  redirectUrl: string;
}

// Constants & Shapes
const SET_SESSION = "user/SET_SESSION";
const SET_REDIRECT_URL = "user/SET_REDIRECT_URL";
const LOGOUT = "user/LOGOUT";
const SET_LOADING = "user/SET_LOADING";

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

interface SetLoadingAction {
  type: typeof SET_LOADING;
}

type UserActionTypes =
  | LogoutAction
  | SetSessionAction
  | SetRedirectUrl
  | SetLoadingAction;

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

export const setLoading = (): UserActionTypes => {
  return {
    type: SET_LOADING,
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
  status: "inactive",
  redirectUrl: "/",
};

export function sessionReducer(
  state = initialState,
  action: UserActionTypes
): SessionState {
  switch (action.type) {
    case SET_SESSION:
      return { ...state, user: action.payload, status: "active" };
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
        status: "inactive",
        redirectUrl: "/",
      };
    case SET_REDIRECT_URL:
      return { ...state, redirectUrl: action.payload };
    case SET_LOADING:
      return { ...state, status: "loading" };
    default:
      return state;
  }
}
