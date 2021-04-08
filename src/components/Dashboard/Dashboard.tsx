import {
  StarOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Layout, Space, Row, Col } from "antd";
import { Content } from "antd/lib/layout/layout";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import MetricCard from "src/components/Dashboard/MetricCard";
import {
  FULL_WIDTH,
  WRAPPER_STYLE,
  BASE_CHART_COLORS,
} from "src/styles/styles";
import { Call } from "src/typings/Call";
import { onlyUnique } from "src/utils";
import DonutChart from "../charts/DonutChart";
import LineChart from "../charts/LineChart";
import Header from "../Header/Header";
import { groupBy, callsToWeeklyData } from "src/utils";

interface Props {
  calls: Call[];
  numIncPeople: number;
}

const Dashboard: React.FC<Props> = ({ calls, numIncPeople }) => {
  const [ratingsCount, setRatingsCount] = useState<number[]>();
  const [callVolume, setCallVolume] = useState<Record<string, number>>();

  useEffect(() => {
    const groups = groupBy(
      calls.filter((call) => !!call.rating),
      (call) => call.rating
    );
    // grooup calls by rating, sort them in ascending order, and count the number of instancces
    const sortedKeys = Object.keys(groups).sort();
    setRatingsCount(sortedKeys.map((key) => groups[parseInt(key)].length));

    // groups calls by week,
    setCallVolume(callsToWeeklyData(calls));
  }, [calls]);

  if (!ratingsCount || !callVolume) return <div />;

  return (
    <Layout>
      <Header
        title="Dashboard"
        subtitle="Analyze your facility data and print the daily call schedule."
        extra={
          [
            // TODO: add this back, complete info is not being populated
            // https://github.com/Ameelio/connect-doc-client/issues/57
            // <PDFDownloadButton
            //   calls={callsToday(calls)}
            //   facility={facility}
            //   canViewDetails={true}
            // />,
            // <PDFDownloadButton
            //   calls={callsToday(calls)}
            //   facility={facility}
            //   canViewDetails={false}
            // />,
          ]
        }
      />
      <Content>
        <Space
          direction="vertical"
          style={{ ...FULL_WIDTH, ...WRAPPER_STYLE }}
          size="large"
        >
          <Row gutter={16}>
            <Col span={8} className="bg-white">
              <MetricCard
                title="Calls This Week"
                value={
                  Object.values(callVolume)[
                    Object.values(callVolume).length - 1
                  ]
                }
                prefix={<StarOutlined />}
                suffix={`calls`}
              />
            </Col>
            <Col span={8} className="bg-white">
              <MetricCard
                title="Live Video Calls"
                value={
                  calls.filter(
                    (call) =>
                      call.status === "live" ||
                      call.status === "missing_monitor"
                  ).length
                }
                prefix={<VideoCameraOutlined />}
                suffix="calls"
              />
            </Col>
            <Col span={8} className="bg-white">
              <MetricCard
                title="Facility Video Usage"
                value={(
                  (calls
                    .map((call) => call.inmateIds)
                    .reduce((prev, curr) => [...prev, ...curr], [])
                    .filter(onlyUnique).length *
                    100) /
                  numIncPeople
                ).toFixed(2)}
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
      </Content>
    </Layout>
  );
};

export default Dashboard;
