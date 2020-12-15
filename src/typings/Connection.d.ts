type ConnectionRequestStatus = "approved" | "rejected" | "pending";

interface ConnectionRequest {
  id: number;
  contact: Contact;
  requestedAt: number;
  approvedAt: number;
  relationship: string;
  requestDetails: string;
  inmateId: number;
  // TODO revisit this data dup
  inmate: Inmate;
  status: string;
  statusDetails: string;
}

interface Connection extends ConnectionRequest {
  approvedAt: Date;
}
