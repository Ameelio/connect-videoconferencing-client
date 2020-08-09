interface Kiosk {
  id: number;
}

type VisitationStatus =
  | "scheduled"
  | "cancelled"
  | "ongoing"
  | "terminated"
  | "completed";

interface Visitation {
  id: number;
  createdAt: Date;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  callUrl: string;
  connection: Connection;
  status: VisitationStatus;
}

interface LiveVisitation extends Visitation {
  kioskId: number;
  callUrl: string;
  startTime: Date;
  endTime: Date;
}

interface RecordedVisitation extends LiveVisitation {
  recordingUrl: string;
}
