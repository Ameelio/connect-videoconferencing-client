import React, { ReactElement } from "react";
import MetricCard from "src/components/cards/MetricCard";
import Container from "src/components/containers/Container";
import LineChart from "src/components/charts/LineChart";
import BarChart from "src/components/charts/BarChart";
import { Statistic, Row, Col, Layout } from "antd";
import {
  StarOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { WRAPPER_STYLE } from "src/utils/constants";
import { PDFDownloadLink, Document, Page } from "@react-pdf/renderer";

const { Content } = Layout;
const MyDoc = () => (
  <Document>
    <Page>// My document data</Page>
  </Document>
);

export default function Dashboard(): ReactElement {
  return (
    <Content style={WRAPPER_STYLE}>
      {/* <div>
        <Row gutter={8}>
          <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
            <Statistic title="Average Rating" value={1128} prefix={<StarOutlined />} suffix={5.0} />
          </Col>
          <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
            <Statistic title="Live Video Calls" value={32} prefix={<VideoCameraOutlined />} />
          </Col>
          <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
            <Statistic title="Video Usage" value={48} suffix="%" prefix={<GlobalOutlined />}/>
          </Col>
        </Row>   
      </div>     */}
      {/* <PDFDownloadLink document={<MyDoc />} fileName="somename.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink> */}
      <div className="d-flex flex-row">
        <Container rounded fluid>
          <LineChart />
        </Container>

        <Container rounded fluid>
          <BarChart />
        </Container>
      </div>
    </Content>
  );
}
