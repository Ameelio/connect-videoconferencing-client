// import { Connection } from "./Connection";

// interface Kiosk {
//   id: number;
// }

// type CallStatus =
//   | "scheduled"
//   | "missing-monitor"
//   | "live"
//   | "ended"
//   | "terminated";

// interface BaseVisitation {
//   id: number;
//   scheduledStartTime: number;
//   scheduledEndTime: number;
//   connectionId: number;
//   kiosk: Kiosk;
//   approved: boolean;
//   videoReady: boolean;
//   endTime?: number;
//   startTime?: number;
//   liveStatus?: string;
//   recordingUrl?: string;
//   status: CallStatus;
// }

// interface Visitation extends BaseVisitation {
//   connection: Connection;
// }

// interface LiveVisitation extends Visitation {
//   startTime: number;
//   liveStatus: string;
//   isUnmuted?: boolean;
// }

// interface RecordedVisitation extends LiveVisitation {
//   endTime: number;
// }
