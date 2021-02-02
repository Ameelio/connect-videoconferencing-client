import React from "react";
import CalendarView from "src/components/calendar/CalendarView";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import Sidebar from "src/components/containers/Sidebar";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";
import { getAllCallsInfo, selectAllCalls } from "src/redux/selectors";

const mapStateToProps = (state: RootState) => ({
  visitations: getAllCallsInfo(state, selectAllCalls(state)),
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
}) => {
  return (
    <div className="d-flex flex-row">
      <Sidebar title="Video BaseCall Calendar"></Sidebar>
      <Wrapper>
        <Container>
          <CalendarView visitations={visitations} />
        </Container>
      </Wrapper>
    </div>
  );
};

export default connector(UnconnectedKioskCalendarContainer);
