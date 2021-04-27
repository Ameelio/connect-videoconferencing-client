import LiveVisitationsPage from "src/pages/LiveCall";
import CalendarPage from "src/pages/Calendar";
import ConnectionRequestsPage from "src/pages/ConnectionRequests";
import LogsPage from "src/pages/CallLogs";
import StaffPage from "src/pages/Staff";
import InmatesPage from "src/pages/Inmates";
import InmateDetailPage from "src/pages/Inmate";
import ContactPage from "src/pages/Contact";

import DashboardPage from "src/pages/Dashboard";
import SettingsPage from "src//pages/Settings";
import RecordingPage from "src/pages/Recording";
import CallRequestsPage from "src/pages/CallRequests";

import { Route } from "src/typings/Common";

export const ROUTES: Route[] = [
  { path: "/calendar", component: CalendarPage, label: "Page" },
  {
    path: "/connection-requests",
    component: ConnectionRequestsPage,
    label: "Connection Requests",
  },
  {
    path: "/call-requests",
    component: CallRequestsPage,
    label: "Call Requests",
  },
  { path: "/logs", component: LogsPage, label: "Search for Visits" },
  { path: "/staff", component: StaffPage, label: "Staff" },
  { path: "/members", component: InmatesPage, label: "Inmates" },
  {
    path: "/members/:id",
    component: InmateDetailPage,
    label: "Incarcerated Individual",
  },
  {
    path: "/contacts/:id",
    component: ContactPage,
    label: "Contact",
  },
  { path: "/visitations", component: LiveVisitationsPage, label: "Live Calls" },
  { path: "/settings", component: SettingsPage, label: "Settings" },
  { path: "/call/:id", component: RecordingPage, label: "Past Call" },
  { path: "/", component: DashboardPage, label: "Dashboard" },
];
