interface Kiosk {
  id: number;
}

interface BaseVisitation {
  id: number;
  scheduledStartTime: number;
  scheduledEndTime: number;
  connectionId: number;
  kiosk: Kiosk;
  approved: boolean;
  videoReady: boolean;
  endTime?: number;
  startTime?: number;
  liveStatus?: string;
  recordingUrl?: string;
}

interface Visitation extends BaseVisitation {
  connection: Connection;
}

interface LiveVisitation extends Visitation {
  startTime: number;
  liveStatus: string;
  isUnmuted?: boolean;
}

interface RecordedVisitation extends LiveVisitation {
  endTime: number;
}

interface CallFilters {
  query?: string;
  startDate?: number;
  endDate?: number;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
  offset?: number;
  approved?: boolean;
  firstLive?: string;
  end?: string;
}
