import LiveVisitationsPage from "src/pages/LiveVisitation";
import CalendarPage from "src/pages/Calendar";
import RequestsPage from "src/pages/ConnectionRequests";
import LogsPage from "src/pages/PastVisitations";
import StaffPage from "src/pages/Staff";
import InmatesPage from "src/pages/Inmate";
import DashboardPage from "src/pages/Dashboard";
import SettingsPage from "src//pages/Settings";
import { Route } from "src/typings/Common";

export enum CardType {
  LiveVisitation = "live",
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
  allowRead: "Allow Read",
  allowCalltimes: "allowCalltimes",
  allowApproval: "allowApproval",
  allowRestructure: "allowRestructure",
  allowMonitor: "allowMonitor",
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

export const PADDING = 16;
export const WRAPPER_STYLE = { padding: PADDING, paddingTop: 0 };

type Routename = string;

export const ROUTES: Route[] = [
  { path: "/calendar", component: CalendarPage, label: "Page" },
  { path: "/requests", component: RequestsPage, label: "Connection Requests" },
  { path: "/logs", component: LogsPage, label: "Search for Visits" },
  { path: "/staff", component: StaffPage, label: "Staff" },
  { path: "/members", component: InmatesPage, label: "Inmates" },
  { path: "/visitations", component: LiveVisitationsPage, label: "Live Calls" },
  { path: "/settings", component: SettingsPage, label: "Settings" },
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
