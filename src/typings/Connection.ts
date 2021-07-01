import { Contact } from "./Contact";
import { Inmate } from "./Inmate";

export type InactiveConnectionStatus = "inactive" | "rejected";
export type ActiveConnectionStatus = "active" | "pending";
export type ConnectionStatus =
  | ActiveConnectionStatus
  | InactiveConnectionStatus;

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
