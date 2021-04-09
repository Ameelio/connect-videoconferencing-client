import { AuthInfo, User } from "src/typings/Session";
import { UNAUTHENTICATED_USER_ID } from "src/utils/constants";

// TODO migrate this to redux slice
// @gabe: I attempted the migraton, but it's creating some wild circular dependeies

type SessionStatus = "inactive" | "active" | "loading";

interface SessionState {
  status: SessionStatus;
  user: User;
  redirectUrl: string;
  authInfo: AuthInfo;
}

// Constants & Shapes
const SET_SESSION = "user/SET_SESSION";
const SET_REDIRECT_URL = "user/SET_REDIRECT_URL";
const LOGOUT = "user/LOGOUT";
const SET_SESSION_STATUS = "user/SET_SESSION_STATUS";

interface SetSessionAction {
  type: typeof SET_SESSION;
  payload: { user: User; token: string };
}
interface LogoutAction {
  type: typeof LOGOUT;
}

interface SetRedirectUrlAction {
  type: typeof SET_REDIRECT_URL;
  payload: string;
}

interface SetSessionStatusAction {
  type: typeof SET_SESSION_STATUS;
  payload: SessionStatus;
}

type UserActionTypes =
  | LogoutAction
  | SetSessionAction
  | SetRedirectUrlAction
  | SetSessionStatusAction;

export const logout = (): UserActionTypes => {
  return {
    type: LOGOUT,
  };
};

export const setSession = (payload: {
  user: User;
  token: string;
}): UserActionTypes => {
  return {
    type: SET_SESSION,
    payload,
  };
};

export const setRedirectUrl = (url: string): UserActionTypes => {
  return {
    type: SET_REDIRECT_URL,
    payload: url,
  };
};

export const setSessionStatus = (status: SessionStatus): UserActionTypes => {
  return {
    type: SET_SESSION_STATUS,
    payload: status,
  };
};
// Reducer
const initialState: SessionState = {
  user: {
    id: UNAUTHENTICATED_USER_ID,
    firstName: "",
    lastName: "",
    email: "",
    staffPositions: [],
  },
  authInfo: {
    id: UNAUTHENTICATED_USER_ID,
    type: "doc",
    token: "",
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
      const { user, token } = action.payload;
      return {
        ...state,
        user,
        authInfo: { token, type: "doc", id: user.id },
        status: "active",
      };
    case LOGOUT:
      return {
        ...state,
        user: {
          id: UNAUTHENTICATED_USER_ID,
          firstName: "",
          lastName: "",
          email: "",
          staffPositions: [],
        },
        status: "inactive",
        redirectUrl: "/",
      };
    case SET_REDIRECT_URL:
      return { ...state, redirectUrl: action.payload };
    case SET_SESSION_STATUS:
      return { ...state, status: action.payload };
    default:
      return state;
  }
}
