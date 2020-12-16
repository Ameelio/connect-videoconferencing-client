import React, { useEffect } from "react";
import CalendarView from "src/components/calendar/CalendarView";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";

import Sidebar from "src/components/containers/Sidebar";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";
import { getVisitations } from "src/api/Visitation";
import { getAllVisitationsInfo } from "src/redux/selectors";

const mapStateToProps = (state: RootState) => ({
  visitations: getAllVisitationsInfo(
    state,
    state.visitations.scheduledVisitations
  ),
  hasLoadedScheduledVisitations:
    state.visitations.hasLoadedScheduledVisitations,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function mondayMorning(): Date {
  const now = new Date();
  const day = now.getDay();
  now.setDate(now.getDate() - day + 1);
  now.setHours(0, 0, 0, 0);
  return now;
}

function fridayEvening(): Date {
  const now = new Date();
  const day = now.getDay();
  now.setDate(now.getDate() - day + 5);
  now.setHours(23, 59, 59, 0);
  return now;
}

const UnconnectedKioskCalendarContainer: React.FC<PropsFromRedux> = ({
  visitations,
  hasLoadedScheduledVisitations,
}) => {
  useEffect(() => {
    if (!hasLoadedScheduledVisitations)
      getVisitations([mondayMorning(), fridayEvening()]);
  });

  return (
    <div className="d-flex flex-row">
      <Sidebar title="Video BaseVisitation Calendar"></Sidebar>
      <Wrapper>
        <Container>
          <CalendarView visitations={visitations} />
        </Container>
      </Wrapper>
    </div>
  );
};

export default connector(UnconnectedKioskCalendarContainer);
