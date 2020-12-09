interface Kiosk {
  id: number;
}

interface Visitation {
  id: number;
  scheduledStartTime: Date;
  scheduledEndTime: Date;

  connection: Connection;
  kiosk: Kiosk;

  approved: boolean;

  // Only exist if it's run for some time
  startTime?: Date;
  endTime?: Date;
  liveStatus?: string;
}
interface LiveVisitation extends Visitation {
  startTime: Date;
  liveStatus: string;
}
interface RecordedVisitation extends LiveVisitation {
  endTime: Date;
}
