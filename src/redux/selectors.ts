import { RootState } from ".";
import { connectionsAdapter } from "./modules/connections";
import { contactsAdapter } from "./modules/contact";
import { inmatesAdapter } from "./modules/inmate";
import { callsAdapter } from "./modules/call";
import { staffAdapter } from "./modules/staff";
import { facilitiesAdapter } from "./modules/facility";
import { BaseCall, Call } from "src/typings/Call";
import { kiosksAdapter } from "./modules/kiosk";
import { groupsAdapter } from "./modules/group";
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
  selectEntities: selectInmateEntities,
} = inmatesAdapter.getSelectors<RootState>((state) => state.inmates);

export const {
  selectById: selectContactById,
  selectAll: selectAllContacts,
  selectEntities: selectContactEntities,
} = contactsAdapter.getSelectors<RootState>((state) => state.contacts);

export const {
  selectById: selectCallById,
  selectAll: selectAllCalls,
} = callsAdapter.getSelectors<RootState>((state) => state.calls);

export const selectMessageByCallId = (state: RootState, callId: string) => {
  return state.calls.messages[callId] || [];
};

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
  selectEntities: selectKioskEntities,
} = kiosksAdapter.getSelectors<RootState>((state) => state.kiosks);

export const {
  selectAll: selectAllGroups,
  selectById: selectGroupById,
  selectEntities: selectGroupEntities,
} = groupsAdapter.getSelectors<RootState>((state) => state.groups);

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

export const getCallInfo = (state: RootState, callId: string) => {
  const plainCall = selectCallById(state, callId);
  if (!plainCall) return;
  return getCallEntities(state, plainCall) as Call;
};

// Inmate
export const selectInmateCallsById = (state: RootState, inmateId: string) => {
  const inmate = selectInmateById(state, inmateId);
  if (!inmate) return;
  const calls = selectAllCalls(state);
  return calls.filter((call) => inmateId in call.inmateIds);
};
