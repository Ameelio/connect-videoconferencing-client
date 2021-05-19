import { CallStatus } from "src/typings/Call";

export const CALL_STATUS_FILTER_OPTIONS: {
  label: string;
  key: string;
  value: CallStatus;
}[] = [
  {
    label: "Terminated",
    key: "terminated",
    value: "terminated",
  },
  {
    label: "Ended",
    key: "ended",
    value: "ended",
  },
  {
    label: "Scheduled",
    key: "scheduled",
    value: "scheduled",
  },
];
