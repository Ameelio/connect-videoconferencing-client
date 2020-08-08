type ConnectionRequestStatus = "approved" | "rejected" | "pending";

interface ConnectionRequest {
  id: number;
  firstName: string;
  lastName: string;
  relationship: string;
  status: ConnectionRequestStatus;
}

interface Connection {
  id: number;
  inmateId: number;
  contactId: number;
  inmate?: Inmate;
  contact?: Contact;
  connectionRequestId: number;
  requestedAt: Date;
  approvedAt: Date;
  recordedVisitations: Map<number, ?RecordedVisitation>;
}
