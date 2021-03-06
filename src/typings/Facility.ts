import { VisitationType } from "./Common";

export interface CallSlot {
  id: string;
  day: number;
  hour: number;
  minute: number;
  duration: number;
  type: VisitationType;
}

export type TentativeCallSlot = Omit<CallSlot, "id">;

export interface Facility {
  id: string;
  name: string;
  fullName: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  addressLineOne: string;
  addressLineTwo: string;
  postal: string;
  timezone: string;
  link: string;
}

export interface SelectedFacility extends Facility {
  callTimes: CallSlot[];
}
