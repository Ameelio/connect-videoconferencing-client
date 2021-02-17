import React, { ReactElement, useEffect, useState } from "react";
import LineChart from "src/components/charts/LineChart";
import DonutChart from "src/components/charts/DonutChart";
import { Row, Col, Layout, Space } from "antd";
import {
  StarOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import {
  BASE_CHART_COLORS,
  FULL_WIDTH,
  WRAPPER_STYLE,
} from "src/styles/styles";
import {
  getCallsInfo,
  selectAllCalls,
  selectTotalInmates,
} from "src/redux/selectors";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { fetchCalls } from "src/redux/modules/call";
import PDFDownloadButton from "./PDFDownloadButton";
import { LiveCall } from "src/typings/Call";
import { onlyUnique } from "src/utils/Common";
import MetricCard from "./MetricCard";
import { format } from "date-fns";
import _ from "lodash";
import { callsToday, callsToWeeklyData } from "src/utils/Call";
import Header from "src/components/Header/Header";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  // TODO update this once we have status selecotr
  facility: state.facilities.selected,
  calls: getCallsInfo(state, selectAllCalls(state)) as LiveCall[],
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

  if (!ratingsCount || !callVolume || !facility) return <div />;

  return (
    <Layout>
      <Header
        title="Dashboard"
        subtitle="Analyze your facility data and print the daily call schedule."
      />
      {/* <PDFDownloadButton calls={callsToday(calls)} facility={facility} /> */}
      <Space
        direction="vertical"
        style={{ ...FULL_WIDTH, ...WRAPPER_STYLE }}
        size="large"
      >
        <Row gutter={16}>
          <Col span={8} className="bg-white">
            <MetricCard
              title="Calls This Week"
              value={Object.values(callVolume)[-1]}
              prefix={<StarOutlined />}
              suffix={`calls`}
            />
          </Col>
          <Col span={8} className="bg-white">
            <MetricCard
              title="Live Video Calls"
              value={calls.filter((call) => call.status === "live").length}
              prefix={<VideoCameraOutlined />}
              suffix="calls"
            />
          </Col>
          <Col span={8} className="bg-white">
            <MetricCard
              title="Facility Video Usage"
              value={
                (calls
                  .map((call) => call.connection.inmateId)
                  .filter(onlyUnique).length *
                  100) /
                numInmates
              }
              suffix="%"
              prefix={<GlobalOutlined />}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <LineChart
              title="Calls"
              label="# calls"
              labels={Object.keys(callVolume)}
              data={Object.values(callVolume)}
            />
          </Col>
          <Col span={12}>
            <DonutChart
              title={`Ratings Breakdown ${format(new Date(), "MMMM")}`}
              data={ratingsCount}
              backgroundColor={BASE_CHART_COLORS}
              hoverBackgroundColor={BASE_CHART_COLORS}
              labels={["Terrible", "Poor", "Okay", "Good", "Amazing"]}
            />
          </Col>
        </Row>
      </Space>
    </Layout>
  );
}

export default connector(Dashboard);
