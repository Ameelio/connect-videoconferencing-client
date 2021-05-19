import React, { useEffect, useState } from "react";
import { TimePicker, Row, Col, Space, Button, Typography, Card } from "antd";
import { CallSlot, TentativeCallSlot } from "src/typings/Facility";
import { WeekdayMap, WEEKDAYS, DEFAULT_DURATION_MS } from "src/utils/constants";
import { FULL_WIDTH } from "src/styles/styles";
import moment from "moment";
import { CallBlock, WeeklySchedule } from "src/typings/Call";
import {
  dayOfWeekAsString,
  mapCallSlotsToTimeBlock,
  mapCallBlockToCallSlots,
} from "src/utils";
import { cloneObject } from "src/utils";
import { format } from "date-fns";

interface Props {
  handleSave: (callSlots: TentativeCallSlot[]) => void;
  callTimes: CallSlot[];
}

const CallHourSettings = ({ handleSave, callTimes }: Props) => {
  const [ranges, setRanges] = useState<WeeklySchedule>();
  const [callSlots, setCallSlots] = useState<TentativeCallSlot[]>([]);
  const dateFormat = "HH:mm";

  // initialize call hour settings based on facility's existing schedule
  useEffect(() => {
    setCallSlots(callTimes);
    setRanges(mapCallSlotsToTimeBlock(callTimes));
  }, [callTimes]);

  if (!ranges) return <div />;

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

  const renderItem = (day: WeekdayMap, ranges: CallBlock[]) => {
    return (
      <Row style={{ width: "100%", margin: 16 }}>
        <Col span={12}>
          <Typography.Title level={5}>
            {dayOfWeekAsString(day)}
          </Typography.Title>
        </Col>
        <Col span={12}>
          <Space direction="vertical" style={FULL_WIDTH}>
            {ranges.map((time) => (
              <TimePicker.RangePicker
                minuteStep={30}
                use12Hours={true}
                defaultValue={[
                  moment(format(new Date(time.start), dateFormat), dateFormat),
                  moment(format(new Date(time.end), dateFormat), dateFormat),
                ]}
                onChange={(values) => {
                  if (!values || !values[0] || !values[1]) return;
                  onChange(
                    values[0].toDate(),
                    values[1].toDate(),
                    day,
                    time.idx
                  );
                }}
                format={dateFormat}
              />
            ))}
            <TimePicker.RangePicker
              format={dateFormat}
              minuteStep={30}
              use12Hours={true}
              onChange={(values) => {
                if (!values || !values[0] || !values[1]) return;
                onChange(
                  values[0].toDate(),
                  values[1].toDate(),
                  day,
                  ranges.length
                );
              }}
            />
          </Space>
        </Col>
      </Row>
    );
  };

  return (
    <Card
      title="Call Hours"
      extra={[
        <Button type="primary" onClick={() => handleSave(callSlots)}>
          Save Changes
        </Button>,
      ]}
    >
      <Space direction="vertical">
        {WEEKDAYS.map((weekday) => renderItem(weekday, ranges[weekday]))}
      </Space>
    </Card>
  );
};

export default CallHourSettings;
