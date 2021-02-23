import { ThunkAction } from "redux-thunk";
import { RootState } from "./index";
import { Action } from "redux";
import { BaseConnection } from "src/typings/Connection";
import {
  BaseCall,
  CallMessage,
  CallParticipant,
  CallStatus,
} from "src/typings/Call";

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
  requester_id: number;
  inmate_id: number;
  messages: RawMessage[];
}

export interface RawMessage {
  callId: number;
  contents: string;
  fromType: string;
  createdAt: string;
}

export function cleanCall(call: RawCall): BaseCall {
  const messages = call.messages.map((message) => ({
    content: message.contents,
    from: message.fromType,
    timestamp: message.createdAt,
  }));
  return {
    id: call.id,
    connectionId: call.connection_id,
    scheduledStartTime: call.start,
    scheduledEndTime: call.end,
    end: call.end,
    approved: call.approved,
    // TODO find right kiosks
    kioskId: call.kiosk_id,
    videoReady: call.video_ready,
    status: call.status,
    rating: call.rating,
    requesterId: call.requester_id,
    inmateId: call.inmate_id,
    messages,
  } as BaseCall;
}
