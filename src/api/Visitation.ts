import { API_URL, fetchAuthenticated, toQueryString } from "./Common";
import url from "url";
import { Store } from "src/redux";
import { setScheduledVisitations } from "src/redux/modules/visitation";
import camelcaseKeys from "camelcase-keys";

interface RawUser {
  id: number;
  first_name: string;
  last_name: string;
}

interface RawInmate {
  id: number;
  first_name: string;
  last_name: string;
  nodes: AmeelioNode[];
  inmate_number: string;
}

interface RawConnection {
  id: number;
  inmate: RawInmate;
  user: RawUser;
  requested_at: number;
  approved_at: number;
  relationship: string;
  request_details: string;
  status: string;
  status_details: string;
}

// function cleanInmate(inmate: RawInmate): Inmate {
//   return {
//     id: inmate.id,
//     inmateNumber: inmate.inmate_number,
//     firstName: inmate.first_name,
//     lastName: inmate.last_name,
//     nodes: inmate.nodes,
//   } as Inmate;
// }

// function createContact(connection: RawConnection) {
//   return {
//     id: connection.user.id,
//     firstName: connection.user.first_name,
//     lastName: connection.user.last_name,
//     relationship: connection.relationship,
//     details: connection.request_details,
//   } as Contact;
// }

// function cleanConnection(connection: RawConnection): Connection {
//   return {
//     id: connection.id,
//     inmateId: cleanInmate(connection.inmate),
//     contactId: createContact(connection),
//     requestedAt: new Date(connection.requested_at),
//     approvedAt: new Date(connection.approved_at),
//     requestDetails: conn
//   } as Connection;
// }

interface RawVisitation {
  id: number;
  connection: Connection;
  users: number[];
  start: number;
  end: number;
  first_live?: number;
  last_live?: number;
  last_status: string;
  room_id: number;
  kiosk_id: number;
  approved: boolean;
}

function cleanVisitation(visitation: RawVisitation): Visitation {
  return {
    id: visitation.id,
    connection: camelcaseKeys(visitation.connection) as Connection,
    scheduledStartTime: new Date(visitation.start),
    scheduledEndTime: new Date(visitation.end),
    startTime: visitation.first_live
      ? new Date(visitation.first_live)
      : undefined,
    endTime: visitation.last_live ? new Date(visitation.last_live) : undefined,
    end: new Date(visitation.end),
    approved: visitation.approved,
    kiosk: { id: visitation.kiosk_id } as Kiosk,
  } as Visitation;
}

export async function getVisitations(
  date: Date[],
  approved = true
): Promise<Visitation[]> {
  const options = [
    ["approved", approved.toString()],
    ["date", date.map((x) => x.getTime()).join(",")],
  ];

  const body = await fetchAuthenticated(
    url.resolve(API_URL, `node/1/calls?` + toQueryString(options))
  );

  if (!body.good || !body.data) {
    throw body;
  }

  const visitations = ((body.data as Record<string, unknown>)
    .calls as RawVisitation[]).map(cleanVisitation);

  Store.dispatch(setScheduledVisitations(visitations));
  return visitations;
}
