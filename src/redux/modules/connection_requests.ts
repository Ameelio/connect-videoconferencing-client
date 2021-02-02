import { updateConnection } from "src/api/Connection";
import { AppThunk } from "src/redux/helpers";
import { openNotificationWithIcon } from "src/utils/utils";

const SET_CONNECTION_REQUESTS = "connection/SET_CONNECTION_REQUESTS";
const DELETE_CONNECTION_REQUEST = "connection/DECLINE_CONNECTION_REQUEST";
const SELECT_CONNECTION_REQUEST = "connection/SELECT_CONNECTION_REQUEST";
const SET_CONNECTIONS = "connection/SET_CONNECTIONS";
const ADD_CONNECTION = "connection/ACCEPT_CONNECTION_REQUEST";

// Action Constants & Shapes
interface SetConnectionRequestsAction {
  type: typeof SET_CONNECTION_REQUESTS;
  payload: BaseConnection[];
}

interface AddConnectionAction {
  type: typeof ADD_CONNECTION;
  payload: BaseConnection;
}

interface DeleteConnectionRequestAction {
  type: typeof DELETE_CONNECTION_REQUEST;
  payload: BaseConnection;
}

interface SetConnectionsAction {
  type: typeof SET_CONNECTIONS;
  payload: BaseConnection[];
}

interface SelectConnectionRequestAction {
  type: typeof SELECT_CONNECTION_REQUEST;
  payload: BaseConnection;
}

type ConnectionActionTypes =
  | SetConnectionRequestsAction
  | AddConnectionAction
  | DeleteConnectionRequestAction
  | SetConnectionsAction
  | SelectConnectionRequestAction;

// Action Creators
export const setConnectionRequests = (
  connections: BaseConnection[]
): ConnectionActionTypes => {
  return {
    type: SET_CONNECTION_REQUESTS,
    payload: connections,
  };
};

const addConnection = (connection: BaseConnection): ConnectionActionTypes => {
  return {
    type: ADD_CONNECTION,
    payload: connection,
  };
};

const deleteConnectionRequeest = (
  connection: BaseConnection
): ConnectionActionTypes => {
  return {
    type: DELETE_CONNECTION_REQUEST,
    payload: connection,
  };
};

export const selectConnectionRequest = (
  connection: BaseConnection
): ConnectionActionTypes => {
  return {
    type: SELECT_CONNECTION_REQUEST,
    payload: connection,
  };
};

export const setConnections = (
  connections: BaseConnection[]
): ConnectionActionTypes => {
  return {
    type: SET_CONNECTIONS,
    payload: connections,
  };
};

interface ConnectionState {
  requests: BaseConnection[];
  selectedRequest: BaseConnection | null;
  connections: BaseConnection[];
}

// Reducer
const initialState: ConnectionState = {
  requests: [],
  connections: [],
  selectedRequest: null,
};

export function connectionsReducer(
  state = initialState,
  action: ConnectionActionTypes
): ConnectionState {
  switch (action.type) {
    case SET_CONNECTIONS:
      return {
        ...state,
        connections: action.payload,
      };
    case SET_CONNECTION_REQUESTS:
      const selectedRequest = action.payload.length ? action.payload[0] : null;
      return {
        ...state,
        requests: action.payload,
        selectedRequest: selectedRequest,
      };
    case ADD_CONNECTION:
      const requestsPostApproval = state.requests.filter(
        (connection) => connection.id !== action.payload.id
      );
      return {
        ...state,
        connections: [...state.connections, action.payload],
        requests: requestsPostApproval,
        selectedRequest: requestsPostApproval.length
          ? requestsPostApproval[0]
          : null,
      };
    case DELETE_CONNECTION_REQUEST:
      const requestsPostDeletion = state.requests.filter(
        (connection) => connection.id !== action.payload.id
      );
      return {
        ...state,
        requests: requestsPostDeletion,
        selectedRequest: requestsPostDeletion.length
          ? requestsPostDeletion[0]
          : null,
      };

    case SELECT_CONNECTION_REQUEST:
      return { ...state, selectedRequest: action.payload };
    default:
      return state;
  }
}

export const acceptConnectionRequest = (
  request: BaseConnection
): AppThunk => async (dispatch) => {
  //TODO replace this with the API call
  await updateConnection(request.id, "approved");
  // const connection: BaseConnection = {
  //   ...request,
  //   approvedAt: new Date(),
  // };
  dispatch(addConnection(request));
  openNotificationWithIcon("Connection created!", "Hooray!", "success");
};

export const declineConnectionRequest = (
  request: BaseConnection
): AppThunk => async (dispatch) => {
  await updateConnection(request.id, "denied");
  //TODO replace this with actual API call
  dispatch(deleteConnectionRequeest(request));
  openNotificationWithIcon("Connection rejected", "Very sad", "info");
};
