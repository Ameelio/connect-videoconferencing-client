import React, { ReactElement, useEffect, useState } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import {
  TimePicker,
  Layout,
  Row,
  Col,
  Space,
  Button,
  Typography,
  PageHeader,
  Tree,
} from "antd";
import { NodeCallSlot } from "src/typings/Facility";
import { WeekdayMap, WEEKDAYS, DEFAULT_DURATION_MS } from "src/utils/constants";
import { WRAPPER_STYLE } from "src/styles/styles";
import moment from "moment";
import { CallBlock, WeeklySchedule } from "src/typings/Call";
import { Tabs } from "antd";
import {
  dayOfWeekAsString,
  mapCallSlotsToTimeBlock,
  mapCallBlockToCallSlots,
} from "src/utils/Call";
import { cloneObject } from "src/utils/utils";
import { updateCallTimes } from "src/redux/modules/facility";
import { format } from "date-fns";
import { selectAllNodes } from "src/redux/selectors";
import { DataNode } from "antd/lib/tree";

const { TabPane } = Tabs;
const { RangePicker } = TimePicker;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  facility: state.facilities.selected,
  nodes: selectAllNodes(state),
});
const mapDispatchToProps = { updateCallTimes };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Tab = "setting" | "facility";

function SettingsContainer({
  facility,
  nodes,
  updateCallTimes,
}: PropsFromRedux): ReactElement {
  const [ranges, setRanges] = useState<WeeklySchedule>();
  const [activeTab, setActiveTab] = useState<Tab>("setting");
  const [callSlots, setCallSlots] = useState<NodeCallSlot[]>([]);

  useEffect(() => {
    if (facility) {
      setCallSlots(facility.callTimes);
      setRanges(mapCallSlotsToTimeBlock(facility.callTimes));
    }
  }, [facility]);

  if (!facility || !ranges) return <div />;

  const dateFormat = "HH:mm";

  const tabCallback = (key: string) => {
    setActiveTab(key as Tab);
  };

  const onChange = (start: Date, end: Date, day: WeekdayMap, idx: number) => {
    const r = cloneObject(ranges) as WeeklySchedule;
    // update call block
    r[day][idx] = {
      start: start.toString(),
      end: end.toString(),
      duration: DEFAULT_DURATION_MS,
      idx,
      day,
    };
    setCallSlots(mapCallBlockToCallSlots(r));
    setRanges(r);
  };

  const handleSubmission = (e: React.MouseEvent) => {
    updateCallTimes({ callSlots, zone: "America_LosAngeles" });
  };
  const renderItem = (day: WeekdayMap, ranges: CallBlock[]) => {
    return (
      <Row style={{ width: "100%", margin: 16 }}>
        <Col flex={1} span={12}>
          <Typography.Text>{dayOfWeekAsString(day)}</Typography.Text>
        </Col>
        {/* <Col> */}
        <Col flex={1} span={12}>
          <Space direction="vertical">
            {ranges.length > 0 ? (
              ranges.map((time) => (
                <RangePicker
                  minuteStep={30}
                  use12Hours={true}
                  defaultValue={[
                    moment(
                      format(new Date(time.start), dateFormat),
                      dateFormat
                    ),
                    moment(format(new Date(time.end), dateFormat), dateFormat),
                  ]}
                  onChange={(values) => {
                    if (!values || !values[0] || !values[1]) return;
                    // TODO with date range picker, convert to right day
                    onChange(
                      values[0].toDate(),
                      values[1].toDate(),
                      day,
                      time.idx
                    );
                  }}
                  format={dateFormat}
                />
              ))
            ) : (
              <RangePicker
                format={dateFormat}
                minuteStep={30}
                use12Hours={true}
                onChange={(values) => {
                  if (!values || !values[0] || !values[1]) return;
                  onChange(values[0].toDate(), values[1].toDate(), day, 0);
                }}
              />
            )}
          </Space>
        </Col>
        {/* </Col> */}
      </Row>
    );
  };

  return (
    <Content>
      <PageHeader title="Settings" />
      <div style={WRAPPER_STYLE}>
        <Content className="main-content-container">
          <Tabs defaultActiveKey={activeTab} onChange={tabCallback}>
            <TabPane tab="General Settings" key="setting">
              <Space direction="vertical">
                {WEEKDAYS.map((weekday) =>
                  renderItem(weekday, ranges[weekday])
                )}
                <Button type="primary" block onClick={handleSubmission}>
                  Save Changes
                </Button>
              </Space>
            </TabPane>
            <TabPane tab="Facility" key="facility">
              <Tree
                treeData={nodes as DataNode[]}
                defaultExpandAll={true}
                draggable={true}
              />
            </TabPane>
            {/* <TabPane tab="Call Hours" key="facility"></TabPane> */}
          </Tabs>
        </Content>
      </div>
    </Content>
  );
}

export default connector(SettingsContainer);
