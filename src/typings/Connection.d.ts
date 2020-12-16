type ConnectionRequestStatus = "approved" | "rejected" | "pending";

interface BaseConnection {
  id: number;
  requestedAt: number;
  approvedAt: number;
  relationship: string;
  requestDetails: string;
  inmateId: number;
  userId: number;
  status: string;
  statusDetails: string;
}

interface Connection extends BaseConnection {
  inmate: Inmate;
  contact: Contact;
}

// type ConnectionRequest = BaseConnection & { status: 'pending'};
// type ApprovedConnection = BaseConnection & { status: 'approved'; approvedAt: Date }
