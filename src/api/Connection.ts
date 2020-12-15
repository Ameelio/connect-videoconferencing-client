import { API_URL, fetchAuthenticated, toQueryString } from "./Common";
import url from "url";
import { Store } from "src/redux";
import {
  setConnectionRequests,
  setConnections,
} from "src/redux/modules/connection_requests";
import { connectionsActions } from "src/redux/modules/connections";
import camelcaseKeys from "camelcase-keys";

export async function getApprovedConnections(): Promise<Connection[]> {
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `node/1/connections?status=approved`)
  );

  if (!body.good || !body.data) {
    throw body;
  }

  const connections = ((body.data as Record<string, unknown>)
    .connections as Object[]).map((connection) =>
    camelcaseKeys(connection)
  ) as Connection[];
  Store.dispatch(connectionsActions.connectionsAddMany(connections));
  return connections;
}

export async function getConnectionRequests(): Promise<ConnectionRequest[]> {
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `node/1/connections?status=pending`)
  );

  if (!body.good || !body.data) {
    throw body;
  }

  console.log(body);
  const connections = ((body.data as Record<string, unknown>)
    .connections as Object[]).map((connection) =>
    camelcaseKeys(connection)
  ) as ConnectionRequest[];

  console.log(connections);

  Store.dispatch(setConnectionRequests(connections));
  return connections;
}

export async function updateConnection(
  connectionId: number,
  status: "approved" | "pending" | "denied"
): Promise<void> {
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `node/1/connection`),
    {
      method: "PUT",
      body: JSON.stringify({ connection_id: connectionId, status }),
    }
  );

  if (!body.good || !body.data) {
    throw body;
  }
}
