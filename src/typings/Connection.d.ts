type ConnectionRequestStatus = "approved" | "rejected" | "pending";

interface ConnectionRequest {
  id: number;
  inmateId: number;
  contactId: number;
  inmate?: Inmate;
  contact?: Contact;
  requestedAt: Date;
}

interface Connection extends ConnectionRequest {
  approvedAt: Date;
  numPastCalls: number;
  recordedVisitations: Map<number, RecordedVisitation>;
}
