import { CallAlert, GridOption } from "src/typings/Call";

export const UNAUTHENTICATED_USER_ID = -999;
export enum WeekdayMap {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export const WEEKDAYS = [
  WeekdayMap.Sunday,
  WeekdayMap.Monday,
  WeekdayMap.Tuesday,
  WeekdayMap.Wednesday,
  WeekdayMap.Thursday,
  WeekdayMap.Friday,
  WeekdayMap.Saturday,
];

// 30 min
export const DEFAULT_DURATION_MS = 1800000;

export const SIDEBAR_WIDTH = 300;

export const GRID_TO_SPAN_WIDTH: { [key in GridOption]: number } = {
  1: 24,
  2: 12,
  4: 12,
  6: 8,
  8: 6,
};

export const GRID_TO_VH_HEIGHT: { [key in GridOption]: number } = {
  1: 80,
  2: 80,
  4: 40,
  6: 40,
  8: 40,
};

export const CALL_ALERTS: CallAlert[] = [
  {
    id: 0,
    title: "Unallowed visitor",
    body:
      "All participants on the call must have  been registered and pre-approved ahead of time. The presence of unallowed visitors may lead to call termination.",
  },
  {
    id: 1,
    title: "Appropriate clothing",
    body:
      "All adult and minor visitors, including attorneys, must be fully dressed in appopriate, conventional clothing which is not unduly provocative, suggestive, or revealing and does not resemble offender attire or present adornments which could be used as a weapon.",
  },
  {
    id: 2,
    title: "Clothing exposure",
    body:
      "Any clothing worn on the top half of the body must have sleeves and not expose the cleavage line, back, midriff and/or underarm at any time while standing, sitting, and/or bending down.",
  },
  {
    id: 3,
    title: "Appropriate undergarments",
    body: "Appropriate undergarments are required, and will not be visible.",
  },
  {
    id: 4,
    title: "No sheer clothing",
    body:
      "Clothing which is sheer or transparent will not be permitted. Clothing that contains holes and/or rips will not be permitted.",
  },
  {
    id: 5,
    title: "Clothing no shorter than knee",
    body:
      "Outer garments worn on the bottom half of the body must be no shorter than the knee while standing.",
  },
  {
    id: 6,
    title: "Leggings no shorter than knee",
    body:
      "Leggings and jeggings may only be worn under outer garments that must be no shorter than the knee while standing.",
  },
];
