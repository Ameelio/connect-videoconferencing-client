import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";

import {
  CALL_ALERTS,
  GRID_TO_SPAN_WIDTH,
  GRID_TO_VH_HEIGHT,
  WRAPPER_STYLE,
} from "src/utils/constants";
import io from "socket.io-client";
import { selectLiveCalls } from "src/redux/selectors";
import { Layout, Row, Col, Space, Pagination } from "antd";
import { fetchCalls } from "src/redux/modules/call";
import VideoChat from "src/pages/LiveCall/VideoChat";
import VideoSkeleton from "./VideoSkeleton";
import { GridOption, LiveCall } from "src/typings/Call";
import _ from "lodash";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  // TODO update this once we have status selecotr
  visitations: selectLiveCalls(state) as LiveCall[],
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

  const onPageChange = (page: number, _?: number) => {
    const startIdx = (page - 1) * grid;
    const endIdx = startIdx + grid;
    setVisibleCalls(visitations.slice(startIdx, endIdx));
  };

  const onShowSizeChange = (_: number, pageSize: number) => {
    handleGridChange(pageSize as GridOption);
  };

  return (
    <Content style={WRAPPER_STYLE}>
      <Space direction="vertical" style={{ width: "100% " }}>
        {visitations.length > 0 && (
          <Pagination
            defaultCurrent={1}
            defaultPageSize={grid}
            onChange={onPageChange}
            pageSize={grid}
            pageSizeOptions={OPTIONS.map((e) => `${e}`)}
            total={visitations.length}
            showSizeChanger={true}
            onShowSizeChange={onShowSizeChange}
          />
        )}
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
