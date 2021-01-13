import React, { useState, useEffect } from "react";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import SidebarCard from "src/components/cards/SidebarCard";
import VisitationCard from "src/components/cards/VisitationCard";

import {
  selectLiveVisitation,
  terminateLiveVisitation,
} from "src/redux/modules/visitation";
import {
  CardType,
  GRID_NUM_TO_SPAN,
  MAX_NUMBER_ROWS,
  SIDEBAR_WIDTH,
  WRAPPER_STYLE,
} from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionDetailsCard";
import Sidebar from "src/components/containers/Sidebar";
import { genFullName } from "src/utils/utils";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";
import io from "socket.io-client";
import { getAllVisitationsInfo, selectAllCalls } from "src/redux/selectors";
import { Menu, Button, Dropdown, Layout, Row, Col, Space } from "antd";
import { fetchCalls } from "src/redux/modules/call";
import VideoChat from "src/pages/LiveVisitation/VideoChat";
import VideoSkeleton from "./VideoSkeleton";
import { chownSync } from "fs";
import { GridOption } from "src/typings/Common";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  // TODO update this once we have status selecotr
  visitations: getAllVisitationsInfo(
    state,
    selectAllCalls(state)
  ) as LiveVisitation[],
  selected: state.visitations.selectedVisitation,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchCalls,
      selectLiveVisitation,
      terminateLiveVisitation,
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const MAX_VH_HEIGHT_FRAMES = 80;

const LiveVisitationContainer: React.FC<PropsFromRedux> = ({
  visitations,
  selected,
  selectLiveVisitation,
  terminateLiveVisitation,
  fetchCalls,
}) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [visibleCalls, setVisibleCalls] = useState<LiveVisitation[]>([]);
  const [numGridCalls, setNumGridCalls] = useState<GridOption>(1);
  const [frameVhHeight, setFrameVhHeight] = useState(MAX_VH_HEIGHT_FRAMES);

  useEffect(() => {
    const now = new Date().getTime();
    fetchCalls({
      approved: true,
      firstLive: [0, now].join(","),
      end: [now, now + 1e8].join(","),
    });
    console.log("connectinf");
    setSocket(io.connect("ws://localhost:8000", { transports: ["websocket"] }));
  }, [fetchCalls]);

  const handleGridChange = (grid: GridOption) => {
    setNumGridCalls(grid);
    // setFrameWidth((window.screen.width - SIDEBAR_WIDTH) / Math.min(grid, MAX_NUMBER_CALLS_PER_ROW));
    setFrameVhHeight(MAX_VH_HEIGHT_FRAMES / Math.min(grid, MAX_NUMBER_ROWS));
  };

  const OPTIONS: GridOption[] = [1, 2, 4, 6, 8];
  const GridMenu = (
    <Menu>
      {OPTIONS.map((option) => (
        <Menu.Item>
          <span onClick={() => handleGridChange(option)}>View by {option}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    setVisibleCalls(visitations.slice(0, numGridCalls));
  }, [numGridCalls, visitations]);

  const handleVideoTermination = () => {
    selected && terminateLiveVisitation(selected);
  };
  console.log(frameVhHeight);

  return (
    <Content style={WRAPPER_STYLE}>
      <Space direction="vertical" style={{ width: "100% " }}>
        <Dropdown overlay={GridMenu} placement="bottomLeft">
          <Button>View by {numGridCalls}</Button>
        </Dropdown>
        <Row gutter={[8, 16]}>
          {Array.from(Array(numGridCalls).keys()).map((idx) => (
            <Col span={GRID_NUM_TO_SPAN[numGridCalls]}>
              {visibleCalls.length - 1 >= idx && socket ? (
                <VideoChat
                  height={frameVhHeight}
                  socket={socket}
                  callId={visibleCalls[idx].id}
                  handleTermination={handleVideoTermination}
                  width="100%"
                />
              ) : (
                <VideoSkeleton width="100%" height={`${frameVhHeight}vh`} />
              )}
            </Col>
          ))}
        </Row>
      </Space>
    </Content>
  );
};

export default connector(LiveVisitationContainer);
