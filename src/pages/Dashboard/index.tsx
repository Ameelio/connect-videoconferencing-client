import React, { ReactElement } from "react";
import LineChart from "src/components/charts/LineChart";
import BarChart from "src/components/charts/BarChart";
import { Statistic, Row, Col, Layout, Button } from "antd";
import {
  StarOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { WRAPPER_STYLE } from "src/utils/constants";
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
  return (
    <Content style={WRAPPER_STYLE}>
      <Row gutter={8}>
        <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
          <Statistic
            title="Average Rating"
            value={
              calls
                .filter((call) => call.rating)
                .reduce((prev, curr) => prev + curr.rating, 0) /
              calls.filter((call) => call.status === "ended").length
            }
            prefix={<StarOutlined />}
            suffix={`/5.0`}
          />
        </Col>
        <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
          <Statistic
            title="Live Video Calls"
            value={calls.filter((call) => call.status === "live").length}
            prefix={<VideoCameraOutlined />}
          />
        </Col>
        <Col span={8} className="bg-white" style={WRAPPER_STYLE}>
          <Statistic
            title="Video Usage"
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
      <Row className="d-flex flex-row">
        {/* <Container rounded fluid> */}
        <LineChart />
        {/* </Container> */}

        {/* <Container rounded fluid> */}
        <BarChart />
        {/* </Container> */}
      </Row>
    </Content>
  );
}

export default connector(Dashboard);
