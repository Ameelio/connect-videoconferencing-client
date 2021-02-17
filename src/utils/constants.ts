import LiveVisitationsPage from "src/pages/LiveCall";
import CalendarPage from "src/pages/Calendar";
import RequestsPage from "src/pages/ConnectionRequests";
import LogsPage from "src/pages/PastVisitations";
import StaffPage from "src/pages/Staff";
import InmatesPage from "src/pages/Inmates";
import InmateDetailPage from "src/pages/Inmate";

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

export const TOKEN_KEY = "token";
export const REMEMBER_TOKEN_KEY = "remember";

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

export const ROUTES: Route[] = [
  { path: "/calendar", component: CalendarPage, label: "Page" },
  { path: "/requests", component: RequestsPage, label: "Connection Requests" },
  { path: "/logs", component: LogsPage, label: "Search for Visits" },
  { path: "/staff", component: StaffPage, label: "Staff" },
  { path: "/members", component: InmatesPage, label: "Inmates" },
  {
    path: "/members/:id",
    component: InmateDetailPage,
    label: "Incarcerated Individual",
  },
  { path: "/visitations", component: LiveVisitationsPage, label: "Live Calls" },
  { path: "/settings", component: SettingsPage, label: "Settings" },
  { path: "/call/:id", component: RecordingPage, label: "Past Call" },
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
    id: 0,
    title: "Unallowed visitor",
    body:
      "All participants on the call must have  been registered and pre-approved ahead of time. The presence of unallowed visitors may lead to call termination.",
  },
  {
    id: 1,
    title: "Appropriate clothing",
    body:
      "All adult and minor visitors, including attorneys, must be fully dressed in appopriate, conventional clothing which is not unduly provocative, suggestive, or revealing and does not resemble offender attire or present adornments which could be used as a weapon.",
  },
  {
    id: 2,
    title: "Clothing exposure",
    body:
      "Any clothing worn on the top half of the body must have sleeves and not expose the cleavage line, back, midriff and/or underarm at any time while standing, sitting, and/or bending down.",
  },
  {
    id: 3,
    title: "Appropriate undergarments",
    body: "Appropriate undergarments are required, and will not be visible.",
  },
  {
    id: 4,
    title: "No sheer clothing",
    body:
      "Clothing which is sheer or transparent will not be permitted. Clothing that contains holes and/or rips will not be permitted.",
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
      "Leggings and jeggings may only be worn under outer garments that must be no shorter than the knee while standing.",
  },
];
