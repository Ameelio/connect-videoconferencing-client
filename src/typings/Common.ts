export type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface TimeRange {
  start: string;
  end: string;
  duration: number;
}

export interface Route {
  path: string;
  component: React.ComponentType<any>;
  label: string;
}
