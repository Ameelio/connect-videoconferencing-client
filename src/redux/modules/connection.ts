import { AppThunk } from "src/redux/helpers";
import { CONNECTION_REQUESTS } from "src/data/sample";

const SET_CONNECTION_REQUESTS = "connection/SET_CONNECTION_REQUESTS";
const DELETE_CONNECTION_REQUEST = "connection/DECLINE_CONNECTION_REQUEST";
const SELECT_CONNECTION_REQUEST = "connection/SELECT_CONNECTION_REQUEST";
const SET_CONNECTIONS = "connection/SET_CONNECTIONS";
const ADD_CONNECTION = "connection/ACCEPT_CONNECTION_REQUEST";

// Action Constants & Shapes
interface SetConnectionRequestsAction {
  type: typeof SET_CONNECTION_REQUESTS;
  payload: ConnectionRequest[];
}

interface AddConnectionAction {
  type: typeof ADD_CONNECTION;
  payload: Connection;
}

interface DeleteConnectionRequestAction {
  type: typeof DELETE_CONNECTION_REQUEST;
  payload: ConnectionRequest;
}

interface SetConnectionsAction {
  type: typeof SET_CONNECTIONS;
  payload: Connection[];
}

interface SelectConnectionRequestAction {
  type: typeof SELECT_CONNECTION_REQUEST;
  payload: ConnectionRequest;
}

type ConnectionActionTypes =
  | SetConnectionRequestsAction
  | AddConnectionAction
  | DeleteConnectionRequestAction
  | SetConnectionsAction
  | SelectConnectionRequestAction;

// Action Creators
const setConnectionRequests = (
  connections: ConnectionRequest[]
): ConnectionActionTypes => {
  return {
    type: SET_CONNECTION_REQUESTS,
    payload: connections,
  };
};

const addConnection = (connection: Connection): ConnectionActionTypes => {
  return {
    type: ADD_CONNECTION,
    payload: connection,
  };
};

const deleteConnectionRequeest = (
  connection: ConnectionRequest
): ConnectionActionTypes => {
  return {
    type: DELETE_CONNECTION_REQUEST,
    payload: connection,
  };
};

export const selectConnectionRequest = (
  connection: ConnectionRequest
): ConnectionActionTypes => {
  return {
    type: SELECT_CONNECTION_REQUEST,
    payload: connection,
  };
};

//TODO uncomment this once we have use case for this function
// const setConnections = (connections: Connection[]) : ConnectionActionTypes => {
//     return {
//         type: SET_CONNECTIONS,
//         payload: connections
//     }
// }

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
      return {
        ...state,
        connections: [...state.connections, action.payload],
        requests: state.requests.filter(
          (connection) => connection.id !== action.payload.id
        ),
      };
    case DELETE_CONNECTION_REQUEST:
      return {
        ...state,
        requests: state.requests.filter(
          (connection) => connection.id !== action.payload.id
        ),
      };

    case SELECT_CONNECTION_REQUEST:
      return { ...state, selectedRequest: action.payload };
    default:
      return state;
  }
}

export const loadConnectionRequests = (): AppThunk => async (dispatch) => {
  //TODO replace this with the API call
  dispatch(setConnectionRequests(CONNECTION_REQUESTS));
};

export const acceptConnectionRequest = (
  request: ConnectionRequest
): AppThunk => async (dispatch) => {
  //TODO replace this with the API call
  const connection: Connection = {
    ...request,
    approvedAt: new Date(),
    recordedVisitations: {} as Map<number, RecordedVisitation>,
    numPastCalls: 0,
  };
  dispatch(addConnection(connection));
};

export const declineConnectionRequest = (
  request: ConnectionRequest
): AppThunk => async (dispatch) => {
  //TODO replace this with actual API call
  dispatch(deleteConnectionRequeest(request));
};
