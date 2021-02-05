import { EventInput } from "@fullcalendar/react";
import { addSeconds, format, differenceInSeconds } from "date-fns";
import { toQueryString } from "src/api/Common";
import { NodeCallSlot } from "src/typings/Facility";
import { STAFF_PERMISSION_OPTIONS, WeekdayMap } from "./constants";
import { CallBlock, CallFilters, Visitation, Weekday } from "src/typings/Call";
import _ from "lodash";
import { notification, message } from "antd";

export const genFullName = (entity?: BasePersona): string =>
  entity ? `${entity.firstName} ${entity.lastName}` : "";

export const genImageUri = (user?: BasePersona): string => {
  return user?.profileImgPath || "default.jpg";
};

export const VisitationToEventInput = (visitation: Visitation): EventInput => {
  return {
    title: `${genFullName(visitation.connection.inmate)} <> ${genFullName(
      visitation.connection.contact
    )}`,
    start: visitation.scheduledStartTime,
    end: visitation.scheduledEndTime,
  };
};

const formatSecondsToMS = (secs: number): string => {
  return format(addSeconds(new Date(0), secs), "mm:ss");
};
export const calculateDurationMS = (start: Date, end: Date): string => {
  const secs = differenceInSeconds(end, start);
  return formatSecondsToMS(secs);
};

export const mapPermissionMap = (
  permissions: Permission[]
): Record<Permission, boolean> => {
  return {
    allowRead: permissions.includes("allowRead"),
    allowApproval: permissions.includes("allowApproval"),
    allowMonitor: permissions.includes("allowMonitor"),
    allowCalltimes: permissions.includes("allowCalltimes"),
    allowRestructure: permissions.includes("allowRestructure"),
  };
};

export const cloneObject = (obj: Object): Object =>
  JSON.parse(JSON.stringify(obj));

export function onlyUnique(
  value: number | string,
  index: number,
  self: (number | string)[]
) {
  return self.indexOf(value) === index;
}

export const createCallOptionsParam = (filters: CallFilters): string => {
  const options = [
    ["approved", filters.approved?.toString() || "true"],
    ["limit", filters.limit?.toString() || "100"],
    ["offset", filters.offset?.toString() || "0"],
  ];
  if (filters.firstLive) options.push(["first_live", filters.firstLive]);
  if (filters.end) options.push(["end", filters.end]);
  if (filters.startDate && filters.endDate)
    options.push(["start", `${filters.startDate},${filters.endDate}`]);
  if (filters.minDuration && filters.maxDuration)
    options.push([
      "duration",
      `${filters.minDuration}, ${filters.maxDuration}`,
    ]);
  if (filters.query?.length) options.push(["global", filters.query]);
  console.log(options);
  return toQueryString(options);
};
export const getInitials = (str: string) => {
  return str
    .split(" ")
    .map((n) => n[0])
    .join("");
};

function hashCode(str: string): number {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 6) - hash);
  }
  return hash;
}

export function generateBgColor(label: string): string {
  const BACKGROUND_COLORS = [
    "#093145",
    "#3C6478",
    "#107896",
    "#43ABC9",
    "#C2571A",
    "#9A2617",
  ];
  return BACKGROUND_COLORS[
    Math.abs(hashCode(label) % BACKGROUND_COLORS.length)
  ];
}

export const openNotificationWithIcon = (
  message: string,
  description: string,
  type: "success" | "info" | "error" | "warning"
) => {
  notification[type]({
    message,
    description,
  });
};

export const showToast = (
  key: string,
  content: string,
  type: "success" | "error" | "warning" | "loading" | "info",
  duration = 3
) => {
  console.log(type);
  switch (type) {
    case "success":
      message.success({ content, key, duration });
      break;
    case "error":
      message.error({ content, key, duration });
      break;
    case "warning":
      message.warning({ content, key, duration });
      break;
    case "loading":
      message.loading({ content, key, duration });
      break;
    default:
      message.info({ content, key, duration });
      break;
  }
};
