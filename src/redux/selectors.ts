import { RootState } from ".";
import { connectionsAdapter } from "./modules/connections";
import { contactsAdapter } from "./modules/contact";
import { inmatesActions, inmatesAdapter } from "./modules/inmate";
import { createSelector } from "reselect";
import { recordingsAdapter } from "./modules/recording";
import { staffAdapter } from "./modules/staff";
import { facilitiesAdapter } from "./modules/facility";

// get selectors from entity adapter
export const {
  selectById: selectConnectionById,
  selectAll: selectAllConnections,
} = connectionsAdapter.getSelectors<RootState>((state) => state.connections);

export const {
  selectById: selectInmateById,
  selectAll: selectAllInmates,
} = inmatesAdapter.getSelectors<RootState>((state) => state.inmates);

export const {
  selectById: selectContactById,
  selectAll: selectAllContacts,
} = contactsAdapter.getSelectors<RootState>((state) => state.contacts);

export const {
  selectById: selectRecordingById,
  selectAll: selectAllRecordings,
} = recordingsAdapter.getSelectors<RootState>((state) => state.recordings);

export const {
  selectById: selectStaffByIdd,
  selectAll: selectAllStaff,
} = staffAdapter.getSelectors<RootState>((state) => state.staff);

export const {
  selectById: selectFacilityById,
  selectAll: selectAllFacilities,
} = facilitiesAdapter.getSelectors<RootState>((state) => state.facilities);

// helper selectors
const getConnectionEntities = (
  state: RootState,
  connection: BaseConnection
): Connection => {
  const inmate = selectInmateById(state, connection.inmateId);
  const contact = selectContactById(state, connection.userId);
  // TODO improve this
  if (!inmate || !contact)
    throw new Error("Failed to locate connection information");
  return { inmate, contact, ...connection };
};

export const getAllConnectionsInfo = (
  state: RootState,
  requests: BaseConnection[]
): Connection[] => {
  return requests.map((request) => getConnectionEntities(state, request));
};

export const getVisitationEntities = (
  state: RootState,
  visitation: BaseVisitation
): Visitation => {
  const connection = selectConnectionById(state, visitation.connectionId);
  if (!connection) throw new Error("Failed to locate connection information");

  // TODO add error handling
  const detailedConnection = getConnectionEntities(state, connection);
  return { ...visitation, connection: detailedConnection };
};

export const getAllVisitationsInfo = (
  state: RootState,
  visitations: BaseVisitation[]
): Visitation[] => {
  return visitations.map((visitation) =>
    getVisitationEntities(state, visitation)
  );
};
