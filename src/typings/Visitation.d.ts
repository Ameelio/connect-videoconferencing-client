interface Kiosk {
  id: number;
}

interface BaseVisitation {
  id: number;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  connectionId: number;
  kiosk: Kiosk;
  approved: boolean;
  endTime?: Date;
  startTime?: Date;
  liveStatus?: string;
}

interface Visitation extends BaseVisitation {
  connection: Connection;
}

interface LiveVisitation extends Visitation {
  startTime: Date;
  liveStatus: string;
}
interface RecordedVisitation extends LiveVisitation {
  endTime: Date;
}
