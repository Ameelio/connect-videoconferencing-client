import React, { ReactElement, useEffect } from "react";
import MetricCard from "src/components/cards/MetricCard";
import Container from "src/components/containers/Container";
import LineChart from "src/components/charts/LineChart";
import BarChart from "src/components/charts/BarChart";
import { Statistic, Row, Col, Layout, Button } from "antd";
import {
  StarOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { WRAPPER_STYLE } from "src/utils/constants";
import {
  PDFDownloadLink,
  Document,
  Page,
  PDFViewer,
  Text,
} from "@react-pdf/renderer";
import { getAllCallsInfo, selectAllCalls } from "src/redux/selectors";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { fetchCalls } from "src/redux/modules/call";
import { endOfMonth, format, startOfMonth } from "date-fns";
import PDFDownloadButton from "./PDFDownloadButton";
import { LiveCall } from "src/typings/Call";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  // TODO update this once we have status selecotr
  facility: state.facilities.selected,
  visitations: getAllCallsInfo(state, selectAllCalls(state)) as LiveCall[],
});

const mapDispatchToProps = { fetchCalls };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function Dashboard({
  facility,
  visitations,
  fetchCalls,
}: PropsFromRedux): ReactElement {
  useEffect(() => {
    fetchCalls({
      startDate: startOfMonth(new Date()).getTime(),
      endDate: endOfMonth(new Date()).getTime(),
    });
  }, [fetchCalls]);

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
      <PDFDownloadButton calls={visitations} facility={facility} />
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

export default connector(Dashboard);
