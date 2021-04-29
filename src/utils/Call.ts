import {
  addMilliseconds,
  format,
  getHours,
  getMinutes,
  startOfMonth,
} from "date-fns";
import { CallBlock, Call, WeeklySchedule, BaseCall } from "src/typings/Call";
import { CallSlot, TentativeCallSlot } from "src/typings/Facility";
import { WeekdayMap, WEEKDAYS, DEFAULT_DURATION_MS } from "./constants";
import _ from "lodash";
import { addWeeks } from "@fullcalendar/react";
import { Contact } from "src/typings/Contact";
import { Dictionary } from "@reduxjs/toolkit";
import { Inmate } from "src/typings/Inmate";
import { notEmpty } from "./Common";
import { Kiosk } from "src/typings/Kiosk";

const callSlotToDateString = (time: CallSlot): string => {
  const date = new Date();
  date.setHours(time.hour);
  date.setMinutes(time.minute);
  return date.toString();
};

const calcEndCallSlot = (time: CallSlot): string => {
  const date = new Date();
  // TODO fix this
  // const offset = date.getDay() - time.day;
  //     date.setDate(date.getDate() + offset);
  //   date.setDate(time.day);
  date.setHours(time.hour);
  date.setMinutes(time.minute);
  // const hi = addMilliseconds(date, duration);
  return addMilliseconds(date, time.duration).toString();
};

export const mapCallSlotsToTimeBlock = (
  callTimes: CallSlot[]
): WeeklySchedule => {
  const groups = _.groupBy(callTimes, (time) => time.day);

  const sorted: [WeekdayMap, CallSlot[]][] = WEEKDAYS.map(
    (weekday: WeekdayMap) => {
      if (!(weekday in groups)) {
        return [weekday, []];
      }
      return [
        weekday,
        groups[weekday].sort((ct1, ct2) => {
          if (ct1.hour > ct2.hour) return 1;
          if (ct1.hour < ct2.hour) return -1;

          if (ct1.minute > ct2.minute) return 1;
          if (ct1.minute < ct2.minute) return -1;
          return 1;
        }),
      ];
    }
  );

  let idx = 0;

  const ranges: {
    [key: number]: CallBlock[];
  }[] = sorted.map(([weekday, times]) => {
    if (!times.length) {
      return { [weekday]: [] };
    }
    const timeRanges: CallBlock[] = [];
    let curr: CallSlot = times[0];
    let first: CallSlot = times[0];

    // create intervals
    for (const time of times.slice(1, times.length)) {
      // if same time, just keep moving through the list e.g 11.00 --> 11.30
      if (curr.hour === time.hour) curr = time;
      else if (time.hour === curr.hour + 1 && time.minute === 0)
        // e.g 11.30 --> 12.00
        curr = time;
      else {
        // new time range
        // TODO account for potential timezone differences?
        timeRanges.push({
          duration: DEFAULT_DURATION_MS,
          start: callSlotToDateString(first),
          end: calcEndCallSlot(curr),
          idx,
          day: first.day,
        });
        // reset
        first = time;
        curr = time;
        idx += 1;
      }
    }
    // create last range
    timeRanges.push({
      duration: DEFAULT_DURATION_MS,
      start: callSlotToDateString(first),
      end: calcEndCallSlot(curr),
      idx,
      day: first.day,
    });

    return { [weekday]: timeRanges };
  });
  return Object.assign({}, ...ranges);
};

export const mapCallBlockToCallSlots = (
  ranges: WeeklySchedule
): TentativeCallSlot[] => {
  const rangeList = WEEKDAYS.map((weekday) => ranges[weekday] || []).reduce(
    (prev, curr) => prev.concat(curr),
    []
  );

  const res = rangeList
    .map((range) => {
      let iterator = new Date(range.start);
      const endTime = new Date(range.end);

      if (iterator > endTime) throw new Error("Invalid time range");

      const callTimes: TentativeCallSlot[] = [];

      while (iterator < endTime) {
        callTimes.push({
          hour: getHours(iterator),
          minute: getMinutes(iterator),
          day: range.day,
          duration: range.duration,
        });
        iterator = addMilliseconds(iterator, range.duration);
      }

      return callTimes;
    })
    .reduce((prev, curr) => prev.concat(curr), []);
  return res;
};

export const dayOfWeekAsString = (dayIndex: WeekdayMap): string => {
  return (
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayIndex] || ""
  );
};

function mondayMorning(date: Date): Date {
  const day = date.getDay();
  date.setDate(date.getDate() - day + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

const callsWithinPeriod = <TCall extends BaseCall>(
  calls: TCall[],
  start: Date,
  end: Date
): TCall[] => {
  return calls.filter(
    (call) =>
      new Date(call.scheduledEnd) >= start && new Date(call.scheduledEnd) <= end
  );
};

export const callsToday = <TCall extends BaseCall>(calls: TCall[]): TCall[] => {
  const morning = new Date();
  morning.setHours(0, 0, 0, 0);
  const evening = new Date();
  evening.setHours(23, 59, 59, 59);
  return callsWithinPeriod(calls, morning, evening);
};

export const callsToWeeklyData = <TCall extends BaseCall>(
  calls: TCall[]
): Record<string, number> => {
  const now = new Date();
  const thisMonday = mondayMorning(now);

  const data: Record<string, number> = {};

  const start = mondayMorning(startOfMonth(now));
  let curr = start;
  while (curr <= thisMonday) {
    const next = addWeeks(curr, 1);
    data[format(curr, "MMM dd")] = callsWithinPeriod(calls, curr, next).length;
    curr = next;
  }
  return data;
};

export function loadCallEntities(
  call: BaseCall,
  contactEnts: Dictionary<Contact>,
  incPeopleEnts: Dictionary<Inmate>,
  kioskEnts: Dictionary<Kiosk>
): Call {
  const contacts = call.userIds.map((id) => contactEnts[id]).filter(notEmpty);

  if (contacts.length !== call.userIds.length) {
    // TODO: sentry error
    // https://github.com/Ameelio/connect-doc-client/issues/60
  }

  const inmates = call.inmateIds
    .map((id) => incPeopleEnts[id])
    .filter(notEmpty);

  if (inmates.length !== call.inmateIds.length) {
    // TODO: sentry error
    // https://github.com/Ameelio/connect-doc-client/issues/60
  }

  const kiosk = kioskEnts[call.kioskId];

  if (!kiosk) {
    // TODO: sentry error
    // https://github.com/Ameelio/connect-doc-client/issues/60
  }

  return {
    ...call,
    contacts,
    inmates,
    kiosk: kiosk || {
      id: -1,
      name: "Failed to load information",
      description: "Failed to load information",
      enabled: true,
      groupId: -1,
    },
  };
}

export function loadAllCallEntities(
  calls: BaseCall[],
  contactEnts: Dictionary<Contact>,
  incPeopleEnts: Dictionary<Inmate>,
  kioskEnts: Dictionary<Kiosk>
): Call[] {
  return calls.map((c) =>
    loadCallEntities(c, contactEnts, incPeopleEnts, kioskEnts)
  );
}

export function getCallInmatesFullNames(call: Call) {
  return call.inmates
    .map((user) => `${user.firstName} ${user.lastName}`)
    .join(", ");
}

export function getCallContactsFullNames(call: Call) {
  return call.contacts
    .map((user) => `${user.firstName} ${user.lastName}`)
    .join(", ");
}
