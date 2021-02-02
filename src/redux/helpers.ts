import { ThunkAction } from "redux-thunk";
import { RootState } from "./index";
import { Action } from "redux";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Visitation helpers
export interface RawVisitation {
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
}

export function cleanVisitation(visitation: RawVisitation): BaseVisitation {
  return {
    id: visitation.id,
    connectionId: visitation.connection_id,
    scheduledStartTime: visitation.start,
    scheduledEndTime: visitation.end,
    startTime: visitation.first_live,
    endTime: visitation.last_live,
    end: visitation.end,
    approved: visitation.approved,
    kiosk: { id: visitation.kiosk_id } as Kiosk,
    videoReady: visitation.video_ready,
    status: visitation.status,
  } as BaseVisitation;
}
