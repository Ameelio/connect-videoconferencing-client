import LiveVisitationsPage from "src/pages/LiveCall";
import CalendarPage from "src/pages/Calendar";
import RequestsPage from "src/pages/ConnectionRequests";
import LogsPage from "src/pages/PastVisitations";
import StaffPage from "src/pages/Staff";
import InmatesPage from "src/pages/Inmate";
import DashboardPage from "src/pages/Dashboard";
import SettingsPage from "src//pages/Settings";
import RecordingPage from "src/pages/Recording";
import { CallAlert, GridOption } from "src/typings/Call";
import { Route } from "src/typings/Common";

export enum CardType {
  LiveCall = "live",
  Contact = "contact",
  ConnectionRequest = "request",
  ApprovedConnectioo = "connection",
  Inmate = "inmate",
  Staff = "staff",
  PastVisitation = "record",
}

export enum CardSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum LoadingTypes {
  AcceptConnection = "accept",
  FetchRecording = "video",
}

export const UNAUTHENTICATED_USER_ID = -999;

export const TOKEN_KEY = "apiToken";
export const REMEMBER_TOKEN_KEY = "rememberToken";

export const STAFF_PERMISSION_OPTIONS: Record<Permission, string> = {
  allowRead: "Can view",
  allowCalltimes: "Manage calltimes",
  allowApproval: "Approve connections",
  allowRestructure: "Reorganize facility",
  allowMonitor: "Monitor live calls",
};

export enum WeekdayMap {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export const PADDING = 24;
export const WRAPPER_STYLE = { padding: PADDING, paddingTop: 0 };

export const ROUTES: Route[] = [
  { path: "/calendar", component: CalendarPage, label: "Page" },
  { path: "/requests", component: RequestsPage, label: "Connection Requests" },
  { path: "/logs", component: LogsPage, label: "Search for Visits" },
  { path: "/staff", component: StaffPage, label: "Staff" },
  { path: "/members", component: InmatesPage, label: "Inmates" },
  { path: "/visitations", component: LiveVisitationsPage, label: "Live Calls" },
  { path: "/settings", component: SettingsPage, label: "Settings" },
  { path: "/call/:id", component: RecordingPage, label: "" },
  { path: "/", component: DashboardPage, label: "Dashboard" },
];

export const WEEKDAYS = [
  WeekdayMap.Sunday,
  WeekdayMap.Monday,
  WeekdayMap.Tuesday,
  WeekdayMap.Wednesday,
  WeekdayMap.Thursday,
  WeekdayMap.Friday,
  WeekdayMap.Saturday,
];

// 30 min
export const DEFAULT_DURATION_MS = 1800000;

export const SIDEBAR_WIDTH = 216;

export const GRID_TO_SPAN_WIDTH: { [key in GridOption]: number } = {
  1: 24,
  2: 12,
  4: 12,
  6: 8,
  8: 6,
};

export const GRID_TO_VH_HEIGHT: { [key in GridOption]: number } = {
  1: 80,
  2: 80,
  4: 40,
  6: 40,
  8: 40,
};

export const CALL_ALERTS: CallAlert[] = [
  {
    id: 1,
    title: "Appropriate clothing",
    body:
      "Outer garments worn on the bottom half of the body must be no shorter than the knee while standing.",
  },
  {
    id: 2,
    title: "Clothing exposure",
    body:
      "Outer garments worn on the bottom half of the body must be no shorter than the knee while standing.",
  },
  {
    id: 3,
    title: "Appropriate undergarments",
    body:
      "Outer garments worn on the bottom half of the body must be no shorter than the knee while standing.",
  },
  {
    id: 4,
    title: "No sheer clothing",
    body:
      "Outer garments worn on the bottom half of the body must be no shorter than the knee while standing.",
  },
  {
    id: 5,
    title: "Clothing no shorter than knee",
    body:
      "Outer garments worn on the bottom half of the body must be no shorter than the knee while standing.",
  },
  {
    id: 6,
    title: "Leggings no shorter than knee",
    body:
      "Outer garments worn on the bottom half of the body must be no shorter than the knee while standing.",
  },
];
