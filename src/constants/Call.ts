import { CallStatus } from "src/typings/Call";
import { RejectionReason, VisitationType } from "src/typings/Common";

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

export const DEFAULT_CALL_REJECTION_REASONS: RejectionReason[] = [
  {
    title: "Storm/Severe Weather",
    description:
      "Due to the risk of severe weather, we'll have to cancel all visitation appointments for today.",
    key: "storm",
  },
  {
    title: "Lockdown",
    description:
      "ICIW is on lockdown. We're very sorry to inform all visitations have been cancelled.",
    key: "lockdown",
  },
  {
    title: "Device is under maintenance",
    description:
      "The kiosk you the call is not working anymore. Please try re-schedule the call",
    key: "broken",
  },
  {
    title: "Sickness",
    description:
      "Your incarcerated loved one is feeling sick and won't be able to join the call today.",
    key: "sick",
  },
];
