import Recording from "src/pages/Recording";
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

export type SearchFilter =
  | "inmateParticipants.inmateIdentification"
  | "inmateParticipants.lastName"
  | "userParticipants.lastName"
  | "userParticipants.id"
  | "kiosk.name";

export interface CallFilters {
  scheduledStart?: { rangeStart: number; rangeEnd: number };
  maxDuration?: number;
  limit?: number;
  offset?: number;
  page?: number;
  "call.status"?: CallStatus[];
  inmateIdentification?: string;
  "inmateParticipants.inmateId"?: string;
  contactId?: string;
  inmateLastName?: string;
  contactLastName?: string;
  kioskName?: string;
}

export type CallStatus =
  | "pending_approval"
  | "scheduled"
  | "cancelled"
  | "missing_monitor"
  | "live"
  | "ended"
  | "terminated"
  | "rejected"
  | "no_show";

export type ISOString = string;
export interface BaseCall {
  id: number;
  facilityId: number;
  kioskId: number;
  status: CallStatus;
  statusDetails?: string;
  scheduledStart: ISOString;
  scheduledEnd: ISOString;
  inmateIds: number[];
  userIds: number[];
  messages: CallMessage[];
  rating: number;
  schedulerId: number;
  schedulerType: "user" | "inmate";
  recordingPath?: string;
  recordingStatus?: "pending" | "processing" | "done";
  videoHandler?: {
    port: string;
    host: string;
  };
}

export interface Call extends BaseCall {
  kiosk: Kiosk;
  inmates: Inmate[];
  contacts: Contact[];
}

export interface DetailedCall extends Call {}

export interface CallParticipant {
  type: "doc" | "inmate" | "user";
  id: number;
}

export interface CallMessage {
  callId: number;
  senderId: number;
  senderType: "inmate" | "user" | "doc";
  contents: string;
  createdAt: string; // ISO string
}
