import { CallStatus } from "src/typings/Call";
import { VisitationType } from "src/typings/Common";

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

export const VISITATION_TYPE_FILTER_OPTIONS: {
  label: string;
  key: string;
  value: VisitationType;
}[] = [
  {
    label: "Family In Person (Contact)",
    key: VisitationType.FAMILY_IN_PERSON,
    value: VisitationType.FAMILY_IN_PERSON,
  },
  {
    label: "Family In Person (No Contact)",
    key: VisitationType.FAMILY_IN_PERSON_NO_CONTACT,
    value: VisitationType.FAMILY_IN_PERSON_NO_CONTACT,
  },
  {
    label: "Video Calls",
    key: VisitationType.FAMILY_VIDEO_CALL,
    value: VisitationType.FAMILY_VIDEO_CALL,
  },
];

export const VISIATION_TYPE_LABEL_MAP = {
  [VisitationType.FAMILY_IN_PERSON]: "Family In Person (Contact)",
  [VisitationType.FAMILY_IN_PERSON_NO_CONTACT]: "Family In Person (No Contact)",
  [VisitationType.FAMILY_VIDEO_CALL]: "Family Video Call",
};
