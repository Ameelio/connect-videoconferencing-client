import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";

import {
  CALL_ALERTS,
  GRID_TO_SPAN_WIDTH,
  GRID_TO_VH_HEIGHT,
} from "src/utils/constants";
import { FULL_WIDTH, WRAPPER_STYLE } from "src/styles/styles";
import io from "socket.io-client";
import { selectLiveCalls } from "src/redux/selectors";
import {
  Menu,
  Button,
  Dropdown,
  Layout,
  Row,
  Col,
  Space,
  Carousel,
  PageHeader,
} from "antd";
import { fetchCalls } from "src/redux/modules/call";
import VideoChat from "src/pages/LiveCall/VideoChat";
import VideoSkeleton from "./VideoSkeleton";
import { GridOption, LiveCall } from "src/typings/Call";
import _ from "lodash";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  visitations: selectLiveCalls(state) as LiveCall[],
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchCalls,
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const MAX_VH_HEIGHT_FRAMES = 80;

const LiveVisitationContainer: React.FC<PropsFromRedux> = ({
  visitations,
  fetchCalls,
}) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [visibleCalls, setVisibleCalls] = useState<LiveCall[]>([]);
  const [grid, setGrid] = useState<GridOption>(1);
  const [frameVhHeight, setFrameVhHeight] = useState(MAX_VH_HEIGHT_FRAMES);
  const [lockedCall, setLockedCall] = useState<LiveCall>();

  const [consumeAudioRecord, setConsumeAudioRecord] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const now = new Date().getTime();
    fetchCalls({
      approved: true,
      firstLive: [0, now].join(","),
      end: [now, now + 1e8].join(","),
    });
    const interval = setInterval(() => {
      const now = new Date().getTime();
      fetchCalls({
        approved: true,
        firstLive: [0, now].join(","),
        end: [now, now + 1e8].join(","),
      });
    }, 30000);
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
    <Content>
      <PageHeader title="Live Calls" />
      <Space direction="vertical" style={{ ...FULL_WIDTH, ...WRAPPER_STYLE }}>
        <Dropdown overlay={GridMenu} placement="bottomLeft">
          <Button>View by {grid}</Button>
        </Dropdown>
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
                    const call = visitations.find((call) => call.id === callId);
                    if (call) setLockedCall(call);
                  }}
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
