import { EventInput } from "@fullcalendar/react";

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    title: "All Day Event",
    start: "2020-08-08",
  },
  {
    title: "Long Event",
    start: "2018-01-07",
    end: "2018-01-10",
  },
  {
    groupId: "999",
    title: "Repeating Event",
    start: "2020-08-09T16:00:00",
  },
  {
    groupId: "999",
    title: "Repeating Event",
    start: "2018-01-16T16:00:00",
  },
  {
    title: "Conference",
    start: "2018-01-11",
    end: "2018-01-13",
  },
  {
    title: "Meeting",
    start: "2018-01-12T10:30:00",
    end: "2018-01-12T12:30:00",
  },
  {
    title: "Lunch",
    start: "2018-01-12T12:00:00",
  },
  {
    title: "Meeting",
    start: "2018-01-12T14:30:00",
  },
  {
    title: "Happy Hour",
    start: "2018-01-12T17:30:00",
  },
  {
    title: "Dinner",
    start: "2018-01-12T20:00:00",
  },
  {
    title: "Birthday Party",
    start: "2018-01-13T07:00:00",
  },
  {
    title: "Click for Google",
    url: "http://google.com/",
    start: "2018-01-28",
  },
];

export function createEventId() {
  return String(eventGuid++);
}
