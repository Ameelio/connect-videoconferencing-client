import React, { useState, useEffect } from "react";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import SidebarCard from "src/components/cards/SidebarCard";
import VisitationCard from "src/components/cards/VisitationCard";

import {
  CALL_ALERTS,
  GRID_TO_SPAN_WIDTH,
  GRID_TO_VH_HEIGHT,
  WRAPPER_STYLE,
} from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionDetailsCard";
import Sidebar from "src/components/containers/Sidebar";
import { genFullName } from "src/utils/utils";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";
import io from "socket.io-client";
import { getAllCallsInfo, selectAllCalls } from "src/redux/selectors";
import {
  Menu,
  Button,
  Dropdown,
  Layout,
  Row,
  Col,
  Space,
  Carousel,
} from "antd";
import { fetchCalls } from "src/redux/modules/call";
import VideoChat from "src/pages/LiveVisitation/VideoChat";
import VideoSkeleton from "./VideoSkeleton";
import { chownSync } from "fs";
import { GridOption } from "src/typings/Call";
import { socketsActions } from "src/redux/modules/socket";
import _ from "lodash";

const { Content } = Layout;
// const { setSocket } = socketsActions;

const mapStateToProps = (state: RootState) => ({
  // TODO update this once we have status selecotr
  visitations: getAllCallsInfo(
    state,
    selectAllCalls(state)
  ) as LiveVisitation[],
  // socket: state.sockets.socket,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchCalls,
      // setSocket
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const MAX_VH_HEIGHT_FRAMES = 80;

const LiveVisitationContainer: React.FC<PropsFromRedux> = ({
  visitations,
  fetchCalls,
  // socket,
  // setSocket,
}) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [visibleCalls, setVisibleCalls] = useState<LiveVisitation[]>([]);
  const [grid, setGrid] = useState<GridOption>(1);
  const [frameVhHeight, setFrameVhHeight] = useState(MAX_VH_HEIGHT_FRAMES);

  const [consumeAudioRecord, setConsumeAudioRecord] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      fetchCalls({
        approved: true,
        firstLive: [0, now].join(","),
        end: [now, now + 1e8].join(","),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchCalls]);

  useEffect(() => {
    if (!socket) {
      setSocket(
        io.connect(
          process.env.REACT_APP_MEDIASOUP_HOSTNAME || "localhost:8000"
          // { transports: ["websocket"] }
        )
      );
    }
  }, [setSocket, socket]);

  useEffect(() => {
    setVisibleCalls(visitations.slice(0, grid));
  }, [grid, visitations]);

  const handleVideoTermination = () => {
    // TODO add redux store request
  };

  // Grid options
  const handleGridChange = (grid: GridOption) => {
    setGrid(grid);
    setFrameVhHeight(GRID_TO_VH_HEIGHT[grid]);
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

  // console.log(consumeAudioRecord);
  return (
    <Content style={WRAPPER_STYLE}>
      <Space direction="vertical" style={{ width: "100% " }}>
        <Dropdown overlay={GridMenu} placement="bottomLeft">
          <Button>View by {grid}</Button>
        </Dropdown>
        {/* <Carousel style={{ width: "100% " }}> */}
        <Row>
          {Array.from(Array(grid).keys()).map((idx) => (
            <Col span={GRID_TO_SPAN_WIDTH[grid]}>
              {visibleCalls.length - 1 >= idx && socket ? (
                <VideoChat
                  height={`${frameVhHeight}vh`}
                  socket={socket}
                  call={visibleCalls[idx]}
                  width="100%"
                  alerts={CALL_ALERTS}
                  terminateCall={handleVideoTermination}
                  muteCall={(callId: number) => {
                    setConsumeAudioRecord(_.omit(consumeAudioRecord, callId));
                  }}
                  unmuteCall={(callId: number) =>
                    setConsumeAudioRecord({
                      ...consumeAudioRecord,
                      [callId]: true,
                    })
                  }
                  isAudioOn={visibleCalls[idx].id in consumeAudioRecord}
                  lockCall={(callId: number) => {
                    console.log(callId);
                  }}
                />
              ) : (
                <VideoSkeleton width="100%" height={`${frameVhHeight}vh`} />
              )}
            </Col>
          ))}
        </Row>
        {/* </Carousel> */}
      </Space>
    </Content>
  );
};

export default connector(LiveVisitationContainer);
