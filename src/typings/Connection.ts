import { Contact } from "./Contact";
import { Inmate } from "./Inmate";

export type ConnectionStatus = "active" | "pending" | "inactive" | "rejected";

export interface BaseConnection {
  id: string;
  requestedAt: number;
  approvedAt: number;
  relationship: string;
  requestDetails: string;
  inmateId: string;
  userId: string;
  status: ConnectionStatus;
  statusDetails: string;
}

export interface Connection extends BaseConnection {
  inmate: Inmate;
  contact: Contact;
}
