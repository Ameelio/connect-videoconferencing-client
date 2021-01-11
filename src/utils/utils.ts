import { EventInput } from "@fullcalendar/react";
import { addSeconds, format, differenceInSeconds } from "date-fns";
import { toQueryString } from "src/api/Common";
import { STAFF_PERMISSION_OPTIONS } from "./constants";

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

export const createCallOptionsParam = (filters: CallFilters): string => {
  const options = [
    ["approved", filters.approved?.toString() || "true"],
    ["limit", filters.limit?.toString() || "100"],
    ["offset", filters.offset?.toString() || "0"],
  ];

  console.log("here");
  console.log(filters);
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
