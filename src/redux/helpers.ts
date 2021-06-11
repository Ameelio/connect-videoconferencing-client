import { ThunkAction } from "redux-thunk";
import { RootState } from "./index";
import { Action } from "redux";
import { BaseCall, CallMessage, CallStatus } from "src/typings/Call";
import { VisitationType } from "src/typings/Common";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// call helpers
export interface CallRO {
  id: string;
  facilityId: string;
  kioskId: string;
  status: CallStatus;
  statusDetails?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  inmateIds: string[];
  userIds: string[];
  rating: number;
  schedulerId: string;
  schedulerType: "user" | "inmate";
  messages: CallMessage[];
  videoHandler?: {
    port: string;
    host: string;
  };
  type: VisitationType;
}

export function cleanCall(call: CallRO): BaseCall {
  return {
    id: call.id,
    facilityId: call.facilityId,
    kioskId: call.kioskId,
    status: call.status,
    statusDetails: call.statusDetails,
    scheduledStart: new Date(call.scheduledStart).toISOString(),
    scheduledEnd: new Date(call.scheduledEnd).toISOString(),
    inmateIds: call.inmateIds,
    userIds: call.userIds,
    rating: call.rating,
    schedulerId: call.schedulerId,
    schedulerType: call.schedulerType,
    messages: call.messages || [],
    videoHandler: call.videoHandler,
    type: call.type,
  };
}
