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
  endTime?: number;
  startTime?: number;
  liveStatus?: string;
}

interface Visitation extends BaseVisitation {
  connection: Connection;
}

interface LiveVisitation extends Visitation {
  startTime: number;
  liveStatus: string;
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
}
// type VisitationFilterType = 'approved' | 'query' | 'approved' | 'limit' | 'offset' | 'global';

// interface CallFilters<T> {
//   [Key: VisitatinFilterType]: T;
// }
