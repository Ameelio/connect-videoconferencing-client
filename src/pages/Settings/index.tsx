import React, { ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/redux";
import {
  TimePicker,
  Layout,
  Row,
  Col,
  Space,
  Button,
  Typography,
  Tree,
  Card,
} from "antd";
import { TentativeCallSlot } from "src/typings/Facility";
import { WeekdayMap, WEEKDAYS, DEFAULT_DURATION_MS } from "src/utils/constants";
import { FULL_WIDTH, WRAPPER_STYLE } from "src/styles/styles";
import moment from "moment";
import { CallBlock, WeeklySchedule } from "src/typings/Call";
import { Tabs } from "antd";
import {
  dayOfWeekAsString,
  mapCallSlotsToTimeBlock,
  mapCallBlockToCallSlots,
} from "src/utils";
import { cloneObject } from "src/utils";
import { updateCallTimes } from "src/redux/modules/facility";
import { format } from "date-fns";
import Header from "src/components/Header/Header";
import Settings from "src/components/Settings";
import { selectAllKiosks } from "src/redux/selectors";

const { TabPane } = Tabs;
const { RangePicker } = TimePicker;
const { Content } = Layout;

type Tab = "setting" | "facility";

function SettingsContainer(): ReactElement {
  const groups = useAppSelector((state) => state.groups.nodes);
  const facility = useAppSelector((state) => state.facilities.selected);
  const kiosks = useAppSelector(selectAllKiosks);
  const dispatch = useAppDispatch();

  if (!facility) return <div />;

  const handleCallHoursChange = (callSlots: TentativeCallSlot[]) => {
    dispatch(
      updateCallTimes({
        newCallSlots: callSlots,
        oldCallSlots: facility.callTimes,
      })
    );
  };

  return (
    <Settings
      groups={groups}
      facility={facility}
      kiosks={kiosks}
      handleCallHoursChange={handleCallHoursChange}
    />
  );
}

export default SettingsContainer;
