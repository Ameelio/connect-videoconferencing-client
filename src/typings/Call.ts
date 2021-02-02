import { WeekdayMap } from "src/utils/constants";
import { Connection } from "./Connection";

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

export interface Kiosk {
  id: number;
}

export type CallStatus =
  | "scheduled"
  | "missing-monitor"
  | "live"
  | "ended"
  | "terminated";

export interface BaseVisitation {
  id: number;
  scheduledStartTime: number;
  scheduledEndTime: number;
  connectionId: number;
  kiosk: Kiosk;
  approved: boolean;
  videoReady: boolean;
  endTime?: number;
  startTime?: number;
  liveStatus?: string;
  recordingUrl?: string;
  status: CallStatus;
}

export interface Visitation extends BaseVisitation {
  connection: Connection;
}

export interface LiveVisitation extends Visitation {
  startTime: number;
  liveStatus: string;
  isUnmuted?: boolean;
}

export interface RecordedVisitation extends LiveVisitation {
  endTime: number;
}
