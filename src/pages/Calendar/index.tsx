import React from "react";
import CalendarView from "src/components/calendar/CalendarView";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { getAllCallsInfo, selectAllCalls } from "src/redux/selectors";

const mapStateToProps = (state: RootState) => ({
  visitations: getAllCallsInfo(state, selectAllCalls(state)),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedKioskCalendarContainer: React.FC<PropsFromRedux> = ({
  visitations,
}) => {
  return (
    <div className="">
      <CalendarView visitations={visitations} />
    </div>
  );
};

export default connector(UnconnectedKioskCalendarContainer);
