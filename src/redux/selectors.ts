import { RootState } from ".";
import { connectionsAdapter } from "./modules/connections";
import { contactsAdapter } from "./modules/contact";
import { inmatesActions, inmatesAdapter } from "./modules/inmate";
import { createSelector } from "reselect";
import { callsAdapter } from "./modules/call";
import { staffAdapter } from "./modules/staff";
import { facilitiesAdapter } from "./modules/facility";
import { BaseConnection, Connection } from "src/typings/Connection";
import { BaseCall, Call } from "src/typings/Call";
import { nodesAdapter } from "./modules/node";
import { kiosksAdapter } from "./modules/kiosk";

// get selectors from entity adapter
export const {
  selectById: selectConnectionById,
  selectAll: selectAllConnections,
} = connectionsAdapter.getSelectors<RootState>((state) => state.connections);

export const {
  selectById: selectInmateById,
  selectAll: selectAllInmates,
  selectTotal: selectTotalInmates,
} = inmatesAdapter.getSelectors<RootState>((state) => state.inmates);

export const {
  selectById: selectContactById,
  selectAll: selectAllContacts,
} = contactsAdapter.getSelectors<RootState>((state) => state.contacts);

export const {
  selectById: selectCallById,
  selectAll: selectAllCalls,
} = callsAdapter.getSelectors<RootState>((state) => state.calls);

export const {
  selectById: selectStaffByIdd,
  selectAll: selectAllStaff,
} = staffAdapter.getSelectors<RootState>((state) => state.staff);

export const {
  selectById: selectFacilityById,
  selectAll: selectAllFacilities,
} = facilitiesAdapter.getSelectors<RootState>((state) => state.facilities);

export const {
  selectById: selectNodeById,
  selectAll: selectAllNodes,
} = nodesAdapter.getSelectors<RootState>((state) => state.nodes);

export const {
  selectById: selectKioskById,
  selectAll: selectAllKiosks,
} = kiosksAdapter.getSelectors<RootState>((state) => state.kiosks);

// Connections
const getConnectionEntities = (
  state: RootState,
  connection: BaseConnection
): Connection => {
  const inmate = selectInmateById(state, connection.inmateId);
  const contact = selectContactById(state, connection.userId);
  // TODO improve this
  if (!inmate)
    throw new Error(
      `Failed to locate information for inmate ${connection.inmateId}`
    );
  if (!contact)
    throw new Error(
      `Failed to locate information for contact ${connection.userId}`
    );
  return { inmate, contact, ...connection };
};

export const selectConnectionRequests = (state: RootState) => {
  return selectAllConnections(state).filter(
    (connection) => connection.status === "pending"
  );
};

export const selectApprovedConnections = (state: RootState) => {
  return selectAllConnections(state).map(
    (connection) => connection.status === "approved"
  );
};

export const getAllConnectionsInfo = (
  state: RootState,
  requests: BaseConnection[]
): Connection[] => {
  return requests.map((request) => getConnectionEntities(state, request));
};

// Calls
export const getCallEntities = (state: RootState, call: BaseCall): Call => {
  const connection = selectConnectionById(state, call.connectionId);
  if (!connection) throw new Error("Failed to locate connection information");

  const kiosk = selectKioskById(state, call.kioskId);
  if (!kiosk) throw new Error("Failed to locate kiosk information");

  // TODO add error handling
  const detailedConnection = getConnectionEntities(state, connection);
  return { ...call, connection: detailedConnection, kiosk };
};

export const getAllCallsInfo = (
  state: RootState,
  visitations: BaseCall[]
): Call[] => {
  return visitations.map((visitation) => getCallEntities(state, visitation));
};

export const getCallInfo = (state: RootState, callId: number): Call | null => {
  const plainCall = selectCallById(state, callId);
  if (!plainCall) return null;
  return getCallEntities(state, plainCall) as Call;
};

export const selectLiveCalls = (state: RootState): Call[] => {
  const calls = selectAllCalls(state);
  return getAllCallsInfo(
    state,
    calls.filter(
      (call) => call.status === "missing-monitor" || call.status === "live"
    )
  );
};
