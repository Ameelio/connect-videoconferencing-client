export enum CardType {
  LiveVisitation = "live",
  Contact = "contact",
  ConnectionRequest = "request",
  ApprovedConnectioo = "connection",
  Inmate = "inmate",
  Staff = "staff",
  PastVisitation = "record",
}

export enum CardSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum LoadingTypes {
  AcceptConnection = "accept",
  FetchRecording = "video",
}

export const UNAUTHENTICATED_USER_ID = -999;

export const TOKEN_KEY = "apiToken";
export const REMEMBER_TOKEN_KEY = "rememberToken";

export const STAFF_PERMISSION_OPTIONS: Record<Permission, string> = {
  allowRead: "Allow Read",
  allowCalltimes: "allowCalltimes",
  allowApproval: "allowApproval",
  allowRestructure: "allowRestructure",
  allowMonitor: "allowMonitor",
};

export enum WeekdayMap {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

export const PADDING = 16;
