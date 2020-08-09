import React, { useEffect } from "react";
import CalendarView from "src/components/calendar/CalendarView";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";

import { loadScheduledVisitations } from "src/redux/modules/visitation";
import Sidebar from "src/components/containers/Sidebar";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";

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
    <div className="d-flex flex-row">
      <Sidebar title="Video Visitation Calendar"></Sidebar>
      <Wrapper>
        <Container>
          <CalendarView visitations={visitations} />
        </Container>
      </Wrapper>
    </div>
  );
};

export default connector(UnconnectedKioskCalendarContainer);
