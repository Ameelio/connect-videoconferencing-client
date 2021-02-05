import { ThunkAction } from "redux-thunk";
import { RootState } from "./index";
import { Action } from "redux";
import { BaseConnection } from "src/typings/Connection";
import { BaseCall, CallStatus, Kiosk } from "src/typings/Call";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// call helpers
export interface RawCall {
  id: number;
  connection: BaseConnection;
  connection_id: number;
  users: number[];
  start: number;
  end: number;
  first_live?: number;
  last_live?: number;
  last_status: string;
  room_id: number;
  kiosk_id: number;
  approved: boolean;
  video_ready: boolean;
  status: CallStatus;
  rating: number;
}

export function cleanCall(call: RawCall): BaseCall {
  return {
    id: call.id,
    connectionId: call.connection_id,
    scheduledStartTime: call.start,
    scheduledEndTime: call.end,
    startTime: call.first_live,
    endTime: call.last_live,
    end: call.end,
    approved: call.approved,
    kiosk: { id: call.kiosk_id } as Kiosk,
    videoReady: call.video_ready,
    status: call.status,
    rating: call.rating,
  } as BaseCall;
}
