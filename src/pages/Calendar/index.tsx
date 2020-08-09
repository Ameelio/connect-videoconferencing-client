import React, { useEffect } from "react";
import { Sidebar } from "react-feather";
import CalendarView from "src/components/calendar/CalendarView";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";

import { loadScheduledVisitations } from "src/redux/modules/visitation";

const mapStateToProps = (state: RootState) => ({
  visitations: state.visitations.scheduledVisitations,
  hasLoadedScheduledVisitations:
    state.visitations.hasLoadedScheduledVisitations,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadScheduledVisitations,
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedKioskCalendarContainer: React.FC<PropsFromRedux> = ({
  loadScheduledVisitations,
  visitations,
  hasLoadedScheduledVisitations,
}) => {
  useEffect(() => {
    if (!hasLoadedScheduledVisitations) loadScheduledVisitations();
  });

  return (
    <div>
      <Sidebar></Sidebar>
      <CalendarView visitations={visitations} />
    </div>
  );
};

export default connector(UnconnectedKioskCalendarContainer);
