import { WeekdayMap } from "src/utils/constants";
import { Connection } from "./Connection";
import { Contact } from "./Contact";
import { Inmate } from "./Inmate";
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
  | "pending_approval"
  | "scheduled"
  | "cancelled"
  | "missing_monitor"
  | "live"
  | "ended"
  | "terminated"
  | "no_show";

export interface BaseCall {
  id: number;
  facilityId: number;
  kioskId: number;
  status: CallStatus;
  statusDetails?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  inmateIds: number[];
  userIds: number[];
  messages: CallMessage[];
  rating: number;
  schedulerId: number;
  schedulerType: "user" | "inmate";
  recordingPath?: string;
  recordingStatus?: "pending" | "processing" | "done";
}

export interface Call extends BaseCall {
  kiosk: Kiosk;
  inmates: Inmate[];
  contacts: Contact[];
}

export interface CallParticipant {
  type: "monitor" | "inmate" | "user";
  id: number;
}

export interface CallMessage {
  callId: number;
  inmateId: number;
  userId: number;
  senderType: "inmate" | "user" | "doc";
  contents: string;
  createdAt: Date;
}
