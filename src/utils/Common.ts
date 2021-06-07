import { EventInput } from "@fullcalendar/react";
import { addSeconds, format, differenceInSeconds } from "date-fns";
import { toQueryString } from "src/api/Common";
import { CallFilters, Call } from "src/typings/Call";

export const genFullName = (entity?: BasePersona): string =>
  entity ? `${entity.firstName} ${entity.lastName}` : "";

export const genImageUri = (user?: BasePersona): string => {
  return user?.profileImagePath || "default.jpg";
};

export const VisitationToEventInput = (call: Call): EventInput => {
  const contactNames = call.contacts.reduce(
    (prev, cur) => `${prev}, ${genFullName(cur)}`,
    ""
  );
  const inmateNames = call.inmates.reduce(
    (prev, cur) => `${prev}, ${genFullName(cur)}`,
    ""
  );
  return {
    title: `${inmateNames} <> ${contactNames}`,
    start: call.scheduledStart,
    end: call.scheduledEnd,
  };
};

const formatSecondsToMS = (secs: number): string => {
  return format(addSeconds(new Date(0), secs), "mm:ss");
};
export const calculateDurationMS = (start: Date, end: Date): string => {
  const secs = differenceInSeconds(end, start);
  return formatSecondsToMS(secs);
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
  const options: string[][] = [];
  for (const k of Object.keys(filters)) {
    const key = k as keyof CallFilters;
    if (key === "scheduledStart") {
      if (
        filters.scheduledStart?.rangeStart &&
        filters.scheduledStart.rangeEnd
      ) {
        options.push([
          key,
          `${filters.scheduledStart.rangeStart},${filters.scheduledStart.rangeEnd}`,
        ]);
      }
    } else if (filters[key]) {
      options.push([key, `${filters[key]}`]);
    }
  }

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

export function notEmpty<TParam>(
  value: TParam | null | undefined
): value is TParam {
  return value !== null && value !== undefined;
}

export const groupBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K,
  mustHave?: K[] // makes it so that if there are no items of key X, it will still be initialized as X: [] instead of X: undefined
) => {
  const result = list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
  if (mustHave) {
    mustHave.forEach((key) => {
      if (!result[key]) {
        result[key] = [];
      }
    });
  }
  return result;
};

export function isSubstring(candidate: string, main: string) {
  return main.toLowerCase().includes(candidate.toLowerCase());
}

export function capitalize(str: string): string {
  if (!str.length) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
