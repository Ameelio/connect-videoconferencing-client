interface VisitationState {
  liveVisitations: LiveVisitation[];
  scheduledVisitations: Visitation[];
  selectedVisitation: LiveVisitation | null;
  hasLoaded: boolean;
  hasLoadedScheduledVisitations: boolean;
  pastVisitations: RecordedVisitation[];
  selectedPastVisitation: RecordedVisitation | null;
  requestedRecordings: Map<number, string>;
}
