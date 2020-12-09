interface Kiosk {
  id: number;
}

interface Visitation {
  id: number;
  scheduledStartTime: Date;
  scheduledEndTime: Date;

  kiosk: Kiosk;

  approved: boolean;

  // Only exist if it's run for some time
  startTime?: Date;
  endTime?: Date;
  liveStatus?: string;
}
