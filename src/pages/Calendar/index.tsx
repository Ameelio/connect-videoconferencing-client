import React, { useEffect } from "react";
import CalendarView from "src/components/calendar/CalendarView";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";

import Sidebar from "src/components/containers/Sidebar";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";
import { getVisitations } from "src/api/Visitation";

const mapStateToProps = (state: RootState) => ({
  visitations: state.visitations.scheduledVisitations,
  hasLoadedScheduledVisitations:
    state.visitations.hasLoadedScheduledVisitations,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedKioskCalendarContainer: React.FC<PropsFromRedux> = ({
  visitations,
  hasLoadedScheduledVisitations,
}) => {
  useEffect(() => {
    if (!hasLoadedScheduledVisitations)
      getVisitations({
        date: [
          new Date(),
          new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        ],
        approved: true,
      });
  });

  return (
    <div className="d-flex flex-row">
      <Sidebar title="Video Visitation Calendar">
        {/* <DropdownButton id="dropdown-basic-button" title="Pod">
  <Dropdown.Item href="#/action-1">Pod #1</Dropdown.Item>
  <Dropdown.Item href="#/action-2">Pod #2</Dropdown.Item>
  <Dropdown.Item href="#/action-3">Pod #3</Dropdown.Item>
</DropdownButton> */}
      </Sidebar>
      <Wrapper>
        <Container>
          <CalendarView visitations={visitations} />
        </Container>
      </Wrapper>
    </div>
  );
};

export default connector(UnconnectedKioskCalendarContainer);
