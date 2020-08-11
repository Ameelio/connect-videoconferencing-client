type ConnectionRequestStatus = "approved" | "rejected" | "pending";

interface ConnectionRequest {
  id: number;
  inmate: Inmate;
  contact: Contact;
  requestedAt: Date;
}

interface Connection extends ConnectionRequest {
  approvedAt: Date;
  numPastCalls: number;
  recordedVisitations: RecordedVisitation[];
}
