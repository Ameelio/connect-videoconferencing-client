import React, { ReactElement, useEffect, useState } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { TimePicker, Layout, Row, Col } from "antd";
import { Header } from "antd/lib/layout/layout";
import { NodeCallTimes } from "src/typings/Node";
import { WeekdayMap } from "src/utils/constants";
import { mapCallTimeToRange } from "src/utils/utils";
import moment from "moment";
import { TimeRange } from "src/typings/Common";

const { RangePicker } = TimePicker;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  facility: state.facilities.selected,
});
const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function SettingsContainer({ facility }: PropsFromRedux): ReactElement {
  const [ranges, setRanges] = useState<
    { day: WeekdayMap; ranges: TimeRange[] }[]
  >();

  useEffect(() => {
    if (facility) setRanges(mapCallTimeToRange(facility.callTimes));
  }, [facility]);

  if (!facility || !ranges) return <div />;

  const format = "HH:mm";

  const renderItem = (range: { day: WeekdayMap; ranges: TimeRange[] }) => {
    return (
      <Layout>
        <Row>
          <Col span={3}>{range.day}</Col>
          <Col span={12}>
            {range.ranges.map((time) => (
              <RangePicker
                // defaultValue={time.startTime}
                minuteStep={30}
                use12Hours={true}
                defaultValue={[
                  moment(time.start, "HH:mm"),
                  moment(time.end, "HH:mm"),
                ]}
                onChange={(values) => console.log(values)}
                format={format}
              />
            ))}
          </Col>
        </Row>
      </Layout>
    );
  };

  return (
    <Layout>
      <Header>Settings</Header>
      <Content>
        {/* map over ranges, create div with daay of week + all ranges */}
        {ranges.map(renderItem)}
      </Content>
    </Layout>
  );
}

export default connector(SettingsContainer);
