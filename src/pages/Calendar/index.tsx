import React from "react";
import CalendarView from "src/components/calendar/CalendarView";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { getAllCallsInfo, selectAllCalls } from "src/redux/selectors";
import { Layout, PageHeader } from "antd";
import { WRAPPER_STYLE } from "src/styles/styles";

const { Content } = Layout;
const mapStateToProps = (state: RootState) => ({
  visitations: getAllCallsInfo(state, selectAllCalls(state)),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedKioskCalendarContainer: React.FC<PropsFromRedux> = ({
  visitations,
}) => {
  return (
    <Content>
      <PageHeader title="Calendar" />
      <div style={WRAPPER_STYLE}>
        <CalendarView visitations={visitations} />
      </div>
    </Content>
  );
};

export default connector(UnconnectedKioskCalendarContainer);
