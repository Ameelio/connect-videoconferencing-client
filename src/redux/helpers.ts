import { ThunkAction } from "redux-thunk";
import { RootState } from "./index";
import { Action } from "redux";
import { BaseCall, CallStatus } from "src/typings/Call";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// call helpers
export interface CallRO {
  id: number;
  facilityId: number;
  kioskId: number;
  status: CallStatus;
  statusDetails?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  inmateIds: number[];
  userIds: number[];
  rating: number;
  schedulerId: number;
  schedulerType: "user" | "inmate";
}

export interface CallMessageRO {
  callId: number;
  contents: string;
  fromType: string;
  createdAt: string;
}

export function cleanCall(call: CallRO): BaseCall {
  return {
    id: call.id,
    facilityId: call.facilityId,
    kioskId: call.kioskId,
    status: call.status,
    statusDetails: call.statusDetails,
    scheduledStart: new Date(call.scheduledStart),
    scheduledEnd: new Date(call.scheduledEnd),
    inmateIds: call.inmateIds,
    userIds: call.userIds,
    rating: call.rating,
    schedulerId: call.schedulerId,
    schedulerType: call.schedulerType,
  } as BaseCall;
}
