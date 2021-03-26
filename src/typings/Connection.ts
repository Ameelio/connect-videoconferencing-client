import { Contact } from "./Contact";
import { Inmate } from "./Inmate";

export type ConnectionStatus = "active" | "pending" | "inactive" | "rejected";

export interface BaseConnection {
  id: number;
  requestedAt: number;
  approvedAt: number;
  relationship: string;
  requestDetails: string;
  inmateId: number;
  userId: number;
  status: ConnectionStatus;
  statusDetails: string;
}

export interface Connection extends BaseConnection {
  inmate: Inmate;
  contact: Contact;
}
