import { RootState } from ".";
import { connectionsAdapter } from "./modules/connections";
import { contactsAdapter } from "./modules/contact";
import { inmatesAdapter } from "./modules/inmate";
import { callsAdapter } from "./modules/call";
import { staffAdapter } from "./modules/staff";
import { facilitiesAdapter } from "./modules/facility";
import { BaseConnection, Connection } from "src/typings/Connection";
import { BaseCall, Call } from "src/typings/Call";
import { kiosksAdapter } from "./modules/kiosk";
import { notEmpty } from "src/utils";

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
  selectById: selectKioskById,
  selectAll: selectAllKiosks,
} = kiosksAdapter.getSelectors<RootState>((state) => state.kiosks);

// Connections
const getConnectionEntities = (
  state: RootState,
  connection: BaseConnection
) => {
  const inmate = selectInmateById(state, connection.inmateId);
  const contact = selectContactById(state, connection.userId);
  // TODO improve this
  if (!inmate) return;
  if (!contact) return;
  return { inmate, contact, ...connection };
};

export const selectConnectionRequests = (state: RootState) => {
  return selectAllConnections(state).filter(
    (connection) => connection.status === "pending"
  );
};

export const selectApprovedConnections = (state: RootState) => {
  return selectAllConnections(state).map(
    (connection) => connection.status === "active"
  );
};

export const selectAllConnectionInfo = (
  state: RootState,
  requests: BaseConnection[]
): Connection[] => {
  return requests
    .map((request) => getConnectionEntities(state, request))
    .filter(notEmpty);
};

// Calls
const getCallEntities = (
  state: RootState,
  call: BaseCall
): Call | undefined => {
  const inmates = call.inmateIds
    .map((id) => selectInmateById(state, id))
    .filter(notEmpty);
  const contacts = call.userIds
    .map((id) => selectContactById(state, id))
    .filter(notEmpty);

  const kiosk = selectKioskById(state, call.kioskId);
  if (!kiosk) return;

  return { ...call, inmates, contacts, kiosk };
};

export const getCallsInfo = (
  state: RootState,
  visitations: BaseCall[]
): Call[] => {
  return visitations
    .map((visitation) => getCallEntities(state, visitation))
    .filter(notEmpty);
};

export const getCallInfo = (state: RootState, callId: number) => {
  const plainCall = selectCallById(state, callId);
  if (!plainCall) return;
  return getCallEntities(state, plainCall) as Call;
};

export const selectLiveCalls = (state: RootState): Call[] => {
  const calls = selectAllCalls(state);
  return getCallsInfo(
    state,
    calls.filter(
      (call) => call.status === "missing_monitor" || call.status === "live"
    )
  );
};

// Inmate

export const selectInmateConnectionsById = (
  state: RootState,
  inmateId: number
) => {
  const inmate = selectInmateById(state, inmateId);
  if (!inmate) return;
  const connections = selectAllConnections(state);
  return selectAllConnectionInfo(
    state,
    connections.filter((connection) => connection.inmateId === inmateId)
  );
};

export const selectInmateCallsById = (state: RootState, inmateId: number) => {
  const inmate = selectInmateById(state, inmateId);
  if (!inmate) return;
  const calls = selectAllCalls(state);
  return calls.filter((call) => inmateId in call.inmateIds);
};
