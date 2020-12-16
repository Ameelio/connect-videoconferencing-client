interface VisitationState {
  liveVisitations: LiveVisitation[];
  scheduledVisitations: BaseVisitation[];
  selectedVisitation: LiveVisitation | null;
  hasLoaded: boolean;
  hasLoadedScheduledVisitations: boolean;
  pastVisitations: RecordedVisitation[];
  selectedPastVisitation: RecordedVisitation | null;
}
