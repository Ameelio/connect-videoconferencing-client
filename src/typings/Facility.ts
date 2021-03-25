export interface AmeelioNode {
  id: number;
  name: string;
}

export interface CallSlot {
  day: number;
  hour: number;
  minute: number;
  duration: number;
}

export interface Facility {
  id: number;
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
  // zone: string;
}
