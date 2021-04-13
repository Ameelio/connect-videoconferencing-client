import { useState, useEffect } from "react";
import { useAppSelector } from "src/redux";
import {
  selectAllConnections,
  selectContactEntities,
  selectInmateEntities,
} from "src/redux/selectors";
import { Connection } from "src/typings/Connection";
import { loadAllConnectionEntities } from "src/utils";

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const baseConnections = useAppSelector(selectAllConnections);
  const contactEnts = useAppSelector(selectContactEntities);
  const inmateEnts = useAppSelector(selectInmateEntities);

  useEffect(() => {
    const requests = baseConnections.filter(
      (connection) => connection.status === "pending"
    );
    setConnections(
      loadAllConnectionEntities(requests, contactEnts, inmateEnts)
    );
  }, [baseConnections, contactEnts, inmateEnts]);

  return connections;
}

export function useConnectionRequests() {
  const [requests, setRequests] = useState<Connection[]>([]);

  const connections = useConnections();

  useEffect(() => {
    setRequests(
      connections.filter((connection) => connection.status === "pending")
    );
  }, [connections]);

  return requests;
}

export function useInmateConnections(id: number) {
  const [inmateConnections, setInmateConnections] = useState<Connection[]>([]);

  const connections = useConnections();

  useEffect(() => {
    setInmateConnections(
      connections.filter((connection) => connection.inmateId === id)
    );
  }, [connections, id]);

  return inmateConnections;
}

export function useConnectionRequestsCount() {
  const baseConnections = useAppSelector(selectAllConnections);

  return baseConnections.filter((connection) => connection.status === "pending")
    .length;
}
