export type ConnectionStatus = "approved" | "denied" | "pending";

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
