import { EventInput } from "@fullcalendar/react";
import {
  addSeconds,
  format,
  differenceInSeconds,
  addMinutes,
  getHours,
  getMinutes,
  getDay,
} from "date-fns";
import { toQueryString } from "src/api/Common";
import { NodeCallTimes } from "src/typings/Node";
import { STAFF_PERMISSION_OPTIONS, WeekdayMap } from "./constants";
import { TimeRange, Weekday } from "src/typings/Common";
import _ from "lodash";
import { notification } from "antd";

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

export const mapCallTimeToRange = (
  callTimes: NodeCallTimes[]
): { day: WeekdayMap; ranges: TimeRange[] }[] => {
  console.log("calltimes");
  console.log(callTimes);
  const groups = _.groupBy(callTimes, (time) => time.start.day);

  console.log(groups);
  const sorted: [WeekdayMap, NodeCallTimes[]][] = [0, 1, 2, 3, 4, 5, 6].map(
    (weekday: WeekdayMap) => {
      if (!(weekday in groups)) {
        return [weekday, []];
      }
      return [
        weekday,
        groups[weekday].sort((ct1, ct2) => {
          if (ct1.start.hour > ct2.start.hour) return 1;
          if (ct1.start.hour < ct2.start.hour) return -1;

          if (ct1.start.minute > ct2.start.minute) return 1;
          if (ct1.start.minute < ct2.start.minute) return -1;
          return 1;
        }),
      ];
    }
  );
  console.log("sorted:");
  console.log(sorted);

  const ranges: { day: WeekdayMap; ranges: TimeRange[] }[] = sorted.map(
    ([weekday, times]) => {
      console.log(weekday);
      console.log(times);
      if (!times.length) {
        return { day: weekday, ranges: [] };
      }
      const timeRanges: TimeRange[] = [];
      let curr: NodeCallTimes = times[0];
      let first: NodeCallTimes = times[0];
      // create intervals
      for (const time of times.slice(1, times.length)) {
        // if same time, just keep moving through the list e.g 11.00 --> 11.30
        if (curr.start.hour === time.start.hour) curr = time;
        else if (
          time.start.hour === curr.start.hour + 1 &&
          time.start.minute === 0
        )
          // e.g 11.30 --> 12.00
          curr = time;
        else {
          const rangeStart = new Date();
          rangeStart.setHours(first.start.hour);
          rangeStart.setMinutes(first.start.minute);
          // new time range
          timeRanges.push({
            duration: 30,
            start: `${first.start.hour}:${first.start.minute}`,
            end: `${curr.start.hour}:${curr.start.minute}`,
          });
          // reset
          first = time;
          curr = time;
        }
      }
      console.log(first);
      // create last range
      const rangeStart = new Date();
      rangeStart.setHours(first.start.hour);
      rangeStart.setMinutes(first.start.minute);
      timeRanges.push({
        duration: 30,
        start: `${first.start.hour}:${first.start.minute}`,
        end: `${curr.start.hour}:${curr.start.minute}`,
      });

      return { day: weekday, ranges: timeRanges };
    }
  );
  console.log("output");
  console.log(ranges);
  return ranges;
};

export const mapRangeToCallTime = (
  ranges: Record<Weekday, TimeRange[]>
): NodeCallTimes[] => {
  const rangeList = (Object.keys(ranges) as Weekday[])
    .map((weekday) => ranges[weekday] || [])
    .reduce((prev, curr) => prev.concat(curr), []);

  return rangeList
    .map((range) => {
      let iterator = new Date(range.start);
      const endTime = new Date(range.end);

      if (iterator > endTime) throw new Error("Invalid time range");

      const callTimes: NodeCallTimes[] = [];

      while (iterator <= endTime) {
        callTimes.push({
          start: {
            hour: getHours(iterator),
            minute: getMinutes(iterator),
            day: getDay(iterator),
          },
          duration: range.duration,
        });
        iterator = addMinutes(iterator, range.duration);
      }

      return callTimes;
    })
    .reduce((prev, curr) => prev.concat(curr), []);
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
