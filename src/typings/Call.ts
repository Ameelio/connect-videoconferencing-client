import Recording from "src/pages/Recording";
import { WeekdayMap } from "src/utils/constants";
import { VisitationType } from "./Common";
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
  | "kiosk.name"
  | "status";
// | "type";

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
  status?: CallStatus;
  // type?: VisitationType;
}

export type InCallStatus = "live" | "missing_monitor" | "ended" | "terminated";
export type CancelledCallStatus = "rejected" | "cancelled";
type PreCallStatus = "scheduled" | "pending_approval";

export type CallStatus =
  | PreCallStatus
  | InCallStatus
  | CancelledCallStatus
  | "no_show";

export type ISOString = string;

export interface CallVideoHandler {
  port: string;
  host: string;
}

export interface BaseCall {
  id: string;
  facilityId: string;
  kioskId: string;
  status: CallStatus;
  statusDetails?: string;
  scheduledStart: ISOString;
  scheduledEnd: ISOString;
  inmateIds: string[];
  userIds: string[];
  rating: number;
  schedulerId: string;
  schedulerType: "user" | "inmate";
  recordingPath?: string;
  recordingStatus?: "pending" | "processing" | "done";
  videoHandler?: CallVideoHandler;
  type: VisitationType;
}

export interface Call extends BaseCall {
  kiosk: Kiosk;
  inmates: Inmate[];
  contacts: Contact[];
}

export interface DetailedCall extends Call {
  messages: CallMessage[];
}

export type ParticipantType = "doc" | "inmate" | "user";

export interface CallParticipant {
  type: ParticipantType;
  id: string; // person ID
}

export interface CallMessage {
  callId: string;
  senderId: string;
  senderType: ParticipantType;
  contents: string;
  createdAt: string; // ISO string
}
