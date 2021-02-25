import { WeekdayMap } from "src/utils/constants";
import { Connection } from "./Connection";
import { Kiosk } from "./Kiosk";

export type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface CallBlock {
  idx: number;
  start: string;
  end: string;
  duration: number;
  day: WeekdayMap;
}

export type WeeklySchedule = {
  [key: number]: CallBlock[];
};

export type GridOption = 1 | 2 | 4 | 6 | 8;

export interface CallAlert {
  id: number;
  title: string;
  body: string;
}

export interface CallFilters {
  query?: string;
  startDate?: number;
  endDate?: number;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
  offset?: number;
  approved?: boolean;
  firstLive?: string;
  end?: string;
}

export type CallStatus =
  | "scheduled"
  | "missing-monitor"
  | "live"
  | "ended"
  | "terminated"
  | "cancelled";

export interface BaseCall {
  id: number;
  scheduledStartTime: number;
  scheduledEndTime: number;
  connectionId: number;
  inmateId: number;
  requesterId: number;
  kioskId: number;
  approved: boolean;
  videoReady: boolean;
  endTime?: number;
  startTime?: number;
  liveStatus?: string;
  recordingUrl?: string;
  messages: CallMessage[];
  rating: number;
  status: CallStatus;
}

export interface Call extends BaseCall {
  connection: Connection;
  kiosk: Kiosk;
}

export interface LiveCall extends Call {
  startTime: number;
  liveStatus: string;
  isUnmuted?: boolean;
}

export interface RecordedCall extends LiveCall {
  endTime: number;
}

export interface CallParticipant {
  type: "monitor" | "inmate" | "user";
  id: number;
}

export interface CallMessage {
  content: string;
  from: string;
  timestamp: string;
}
