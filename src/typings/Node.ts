// import { Weekdays } from "src/utils/constants";

export interface AmeelioNode {
  id: number;
  name: string;
}

export interface NodeCallTimes {
  start: {
    day: number;
    hour: number;
    minute: number;
  };
  duration: number;
}

export interface Facility {
  nodeId: number;
  name: string;
  fullName: string;
  city: string;
  state: string;
}

export interface SelectedFacility extends Facility {
  callTimes: NodeCallTimes[];
  // zone: string;
}
