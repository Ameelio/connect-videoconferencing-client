import { Dictionary } from "@reduxjs/toolkit";
import { BaseConnection, Connection } from "src/typings/Connection";
import { Contact } from "src/typings/Contact";
import { Inmate } from "src/typings/Inmate";

export function loadConnectionEntities(
  connection: BaseConnection,
  contactEnts: Dictionary<Contact>,
  inmateEnts: Dictionary<Inmate>
): Connection {
  const contact = contactEnts[connection.userId];

  if (!contact) {
    throw new Error("Failed to load contact information");
  }

  const inmate = inmateEnts[connection.inmateId];

  if (!inmate) {
    throw new Error("Failed to load incarcerated person information");
  }

  return {
    ...connection,
    inmate,
    contact,
  };
}

export function loadAllConnectionEntities(
  connections: BaseConnection[],
  contactEnts: Dictionary<Contact>,
  incPeopleEnts: Dictionary<Inmate>
): Connection[] {
  return connections.map((c) =>
    loadConnectionEntities(c, contactEnts, incPeopleEnts)
  );
}
