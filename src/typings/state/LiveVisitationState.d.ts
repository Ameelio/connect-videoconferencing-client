interface LiveVisitationState {
  liveVisitations: LiveVisitation[];
  scheduledVisitations: Visitation[];
  selectedVisitation?: LiveVisitation;
  hasLoaded: boolean;
  hasLoadedScheduledVisitations: boolean;
}
