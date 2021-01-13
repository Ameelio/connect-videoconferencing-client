import { WeekdayMap } from "src/utils/constants";

export type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface CallBlock {
  idx: number;
  start: string;
  end: string;
  duration: number;
  day: WeekdayMap;
}

export interface Route {
  path: string;
  component: React.ComponentType<any>;
  label: string;
}

export type WeeklySchedule = {
  [key: number]: CallBlock[];
};

export type GridOption = 1 | 2 | 4 | 6 | 8;
