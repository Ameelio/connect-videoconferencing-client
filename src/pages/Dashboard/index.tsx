import React, { ReactElement, useEffect, useState } from "react";
import LineChart from "src/components/charts/LineChart";
import BarChart from "src/components/charts/BarChart";
import { Row, Col, Layout, Button } from "antd";
import {
  StarOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { BASE_CHART_COLORS, WRAPPER_STYLE } from "src/styles/styles";
import {
  getAllCallsInfo,
  selectAllCalls,
  selectTotalInmates,
} from "src/redux/selectors";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { fetchCalls } from "src/redux/modules/call";
import PDFDownloadButton from "./PDFDownloadButton";
import { LiveCall } from "src/typings/Call";
import { onlyUnique } from "src/utils/utils";
import MetricCard from "./MetricCard";
import { format, getMonth } from "date-fns";
import _ from "lodash";
import { callsToWeeklyData } from "src/utils/Call";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  // TODO update this once we have status selecotr
  facility: state.facilities.selected,
  calls: getAllCallsInfo(state, selectAllCalls(state)) as LiveCall[],
  numInmates: selectTotalInmates(state),
});

const mapDispatchToProps = { fetchCalls };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function Dashboard({
  facility,
  calls,
  numInmates,
}: PropsFromRedux): ReactElement {
  const [ratingsCount, setRatingsCount] = useState<number[]>();
  const [callVolume, setCallVolume] = useState<Record<string, number>>();

  useEffect(() => {
    const groups = _.groupBy(
      calls.filter((call) => !!call.rating),
      (call) => call.rating
    );
    const sortedKeys = _.keys(groups).sort();
    setRatingsCount(sortedKeys.map((key) => groups[key].length));
    setCallVolume(callsToWeeklyData(calls));
  }, [calls]);

  if (!ratingsCount || !callVolume) return <div />;

  return (
    <Content style={WRAPPER_STYLE}>
      <Row gutter={8}>
        <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
          <MetricCard
            title="Average Rating"
            value={(
              calls.reduce((prev, curr) => prev + curr.rating || 0, 0) /
              calls.filter((call) => call.status === "ended").length
            ).toFixed(1)}
            prefix={<StarOutlined />}
            suffix={`/5.0`}
          />
        </Col>
        <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
          <MetricCard
            title="Live Video Calls"
            value={calls.filter((call) => call.status === "live").length}
            prefix={<VideoCameraOutlined />}
            suffix="calls"
          />
        </Col>
        <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
          <MetricCard
            title="Facility Video Usage"
            value={
              (calls.map((call) => call.connection.inmateId).filter(onlyUnique)
                .length *
                100) /
              numInmates
            }
            suffix="%"
            prefix={<GlobalOutlined />}
          />
        </Col>
      </Row>
      <PDFDownloadButton calls={calls} facility={facility} />
      <Row>
        <Col span={12}>
          <LineChart
            title="Calls"
            label="# calls"
            labels={Object.keys(callVolume)}
            data={Object.values(callVolume)}
          />
        </Col>
        <Col span={12}>
          <BarChart
            title={`Ratings Breakdown ${format(new Date(), "MMMM")}`}
            data={ratingsCount}
            backgroundColor={BASE_CHART_COLORS}
            hoverBackgroundColor={BASE_CHART_COLORS}
            labels={["Terrible", "Poor", "Okay", "Good", "Amazing"]}
          />
        </Col>
      </Row>
    </Content>
  );
}

export default connector(Dashboard);
