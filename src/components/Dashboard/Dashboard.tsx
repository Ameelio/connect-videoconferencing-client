import {
  StarOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
  DownOutlined,
  UserOutlined,
  FilePdfOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Space,
  Row,
  Col,
  Button,
  Typography,
  Spin,
  Dropdown,
  Menu,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import { differenceInMinutes, format } from "date-fns";
import React, { useEffect, useState } from "react";
import MetricCard from "src/components/Dashboard/MetricCard";
import {
  FULL_WIDTH,
  WRAPPER_STYLE,
  BASE_CHART_COLORS,
} from "src/styles/styles";
import { Call } from "src/typings/Call";
import { callsToDailyLogs, callsToday, onlyUnique } from "src/utils";
import DonutChart from "../charts/DonutChart";
import LineChart from "../charts/LineChart";
import Header from "../Header/Header";
import { groupBy, callsToWeeklyData } from "src/utils";
import PDFDownloadButton from "./PDFDownloadButton";
import { SelectedFacility } from "src/typings/Facility";
import { CSVLink, CSVDownload } from "react-csv";

interface Props {
  calls: Call[];
  totalInmates: number;
  facility: SelectedFacility;
  lastUpdatedAt: Date;
  isRefreshing: boolean;
  refresh: () => void;
}

const Dashboard: React.FC<Props> = ({
  calls,
  totalInmates,
  facility,
  lastUpdatedAt,
  isRefreshing,
  refresh,
}) => {
  const [ratingsCount, setRatingsCount] = useState<number[]>();
  const [callVolume, setCallVolume] = useState<Record<string, number>>();
  const [lastUpdatedAtMin, setLastUpdatedAtMin] = useState(0);

  const [dailyScheduleCalls, setDailyScheduleCall] = useState<Call[]>([]);

  useEffect(() => setDailyScheduleCall(callsToday(calls)), [calls]);

  useEffect(() => {
    const timeout = setInterval(() => {
      setLastUpdatedAtMin(differenceInMinutes(new Date(), lastUpdatedAt));
    }, 1000);

    return () => clearInterval(timeout);
  }, [lastUpdatedAt]);

  useEffect(() => {
    const groups = groupBy(
      calls.filter((call) => !!call.rating),
      (call) => call.rating,
      [1, 2, 3, 4, 5]
    );
    // grooup calls by rating, sort them in ascending order, and count the number of instancces
    const sortedKeys = Object.keys(groups).sort();
    setRatingsCount(sortedKeys.map((key) => groups[parseInt(key)].length));

    // groups calls by week,
    setCallVolume(callsToWeeklyData(calls));
  }, [calls]);

  if (!ratingsCount || !callVolume) return <div />;

  const scheduleOptionsMenu = (
    <Menu>
      <Menu.Item key="1" icon={<FilePdfOutlined />}>
        <PDFDownloadButton
          calls={dailyScheduleCalls}
          facility={facility}
          canViewDetails={true}
        />
      </Menu.Item>
      <Menu.Item key="2" icon={<FilePdfOutlined />}>
        <PDFDownloadButton
          calls={dailyScheduleCalls}
          facility={facility}
          canViewDetails={false}
        />
      </Menu.Item>
      <Menu.Item key="3" icon={<UnorderedListOutlined />}>
        <CSVLink
          data={callsToDailyLogs(dailyScheduleCalls)}
          target="_blank"
          filename={`Daily Logs ${facility.name}@${format(
            new Date(),
            "MM/dd/yyyy-HH:mm"
          )}`}
        >
          Daily Logs (CSV)
        </CSVLink>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Header
        title="Dashboard"
        subtitle="Analyze your facility data and print the daily call schedule."
        extra={[
          <Dropdown overlay={scheduleOptionsMenu}>
            <Button>
              Download Schedule <DownOutlined />
            </Button>
          </Dropdown>,
          <div>
            {lastUpdatedAtMin > 5 && !isRefreshing && (
              <div>
                <Typography.Text type="secondary" className="italic">
                  Computed {lastUpdatedAtMin} minutes ago
                </Typography.Text>
                <Button type="link" onClick={refresh}>
                  Refresh
                </Button>
              </div>
            )}
          </div>,
          <div>
            {isRefreshing && (
              <div>
                <Spin />
                <Typography.Text type="secondary">
                  Updating with live data
                </Typography.Text>
              </div>
            )}
          </div>,
        ]}
      />
      <Content>
        <Space
          direction="vertical"
          style={{ ...FULL_WIDTH, ...WRAPPER_STYLE }}
          size="large"
        >
          <Row>
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
                value={calls.filter((call) => call.status === "live").length}
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
                  totalInmates
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
