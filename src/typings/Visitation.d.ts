interface Kiosk {
  id: number;
}
LiveVisitationStatus =
  "scheduled" | "cancelled" | "ongoing" | "terminated" | "completed";

interface LiveVisitation {
  id: number;
  kioskId: number;
  callUrl: string;
  createdAt: Date;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  startTime: Date;
  endTime: Date;
  status: LiveVisitationStatus;
  connection: Connection;
}

interface RecordedVisitation {
  id: number;
  visitation: LiveVisitation;
  recordingUrl: string;
}
