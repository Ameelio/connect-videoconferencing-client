type ConnectionRequestStatus = "approved" | "rejected" | "pending";

interface BaseConnection {
  id: number;
  requestedAt: number;
  approvedAt: number;
  relationship: string;
  requestDetails: string;
  inmateId: number;
  userId: number;
  status: ConnectionRequestStatus;
  statusDetails: string;
}

interface Connection extends BaseConnection {
  inmate: Inmate;
  contact: Contact;
}
