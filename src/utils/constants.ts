export enum CardType {
  LiveVisitation = "live",
  Contact = "contact",
  ConnectionRequest = "request",
  Connection = "connection",
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
