import {
  addMilliseconds,
  addMinutes,
  format,
  getDay,
  getHours,
  getMinutes,
} from "date-fns";
import { CallBlock, Weekday, WeeklySchedule } from "src/typings/Common";
import { NodeCallSlot } from "src/typings/Node";
import { WeekdayMap, WEEKDAYS } from "./constants";
import _ from "lodash";

const callSlotToDateString = (time: NodeCallSlot): string => {
  const date = new Date();
  date.setHours(time.start.hour);
  date.setMinutes(time.start.minute);
  return date.toString();
};

const calcEndCallSlot = (time: NodeCallSlot): string => {
  const date = new Date();
  date.setDate(time.start.day);
  date.setHours(time.start.hour);
  date.setMinutes(time.start.minute);
  // const hi = addMilliseconds(date, duration);
  return addMilliseconds(date, time.duration).toString();
};

export const mapCallSlotsToTimeBlock = (
  callTimes: NodeCallSlot[]
): WeeklySchedule => {
  console.log("calltimes");
  console.log(callTimes);
  const groups = _.groupBy(callTimes, (time) => time.start.day);

  console.log(groups);
  const sorted: [WeekdayMap, NodeCallSlot[]][] = WEEKDAYS.map(
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
  let idx = 0;

  const ranges: {
    [key: number]: CallBlock[];
  }[] = sorted.map(([weekday, times]) => {
    // console.log(weekday);
    // console.log(times);
    if (!times.length) {
      return { [weekday]: [] };
    }
    const timeRanges: CallBlock[] = [];
    let curr: NodeCallSlot = times[0];
    let first: NodeCallSlot = times[0];

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
        // new time range
        // TODO account for potential timezone differences?
        timeRanges.push({
          duration: 30,
          start: callSlotToDateString(first),
          end: calcEndCallSlot(curr),
          idx,
          day: first.start.day,
        });
        // reset
        first = time;
        curr = time;
        idx += 1;
      }
    }
    // create last range
    timeRanges.push({
      duration: 30,
      start: callSlotToDateString(first),
      end: calcEndCallSlot(curr),
      idx,
      day: first.start.day,
    });

    return { [weekday]: timeRanges };
  });
  console.log("output");
  console.log(ranges);
  return Object.assign({}, ...ranges);
};

export const mapCallBlockToCallSlots = (
  ranges: WeeklySchedule
): NodeCallSlot[] => {
  const rangeList = WEEKDAYS.map((weekday) => ranges[weekday] || []).reduce(
    (prev, curr) => prev.concat(curr),
    []
  );

  console.log(rangeList);
  return rangeList
    .map((range) => {
      let iterator = new Date(range.start);
      const endTime = new Date(range.end);

      if (iterator > endTime) throw new Error("Invalid time range");

      const callTimes: NodeCallSlot[] = [];

      while (iterator <= endTime) {
        callTimes.push({
          start: {
            hour: getHours(iterator),
            minute: getMinutes(iterator),
            day: getDay(range.day),
          },
          duration: range.duration,
        });
        iterator = addMinutes(iterator, range.duration);
      }

      return callTimes;
    })
    .reduce((prev, curr) => prev.concat(curr), []);
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
