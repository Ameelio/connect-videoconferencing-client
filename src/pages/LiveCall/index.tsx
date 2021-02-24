import React, { useState, useEffect, useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import {
  CALL_ALERTS,
  GRID_TO_SPAN_WIDTH,
  GRID_TO_VH_HEIGHT,
} from "src/utils/constants";
import { FULL_WIDTH, WRAPPER_STYLE } from "src/styles/styles";
import io from "socket.io-client";
import { selectLiveCalls } from "src/redux/selectors";
import { Layout, Row, Col, Space, Pagination, PageHeader } from "antd";
import { fetchCalls, callsActions } from "src/redux/modules/call";
import VideoChat from "src/pages/LiveCall/VideoChat";
import VideoSkeleton from "./VideoSkeleton";
import { CallMessage, GridOption, LiveCall } from "src/typings/Call";
import _ from "lodash";
import Header from "src/components/Header/Header";
import { MessageDisplay } from "src/components/calls/MessageDisplay";

const { Content, Sider } = Layout;

const { addMessage } = callsActions;

const mapStateToProps = (state: RootState) => ({
  visitations: selectLiveCalls(state) as LiveCall[],
});

const mapDispatchToProps = {
  fetchCalls,
  addMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const MAX_VH_HEIGHT_FRAMES = 80;
const OPTIONS: GridOption[] = [1, 2, 4, 6, 8];

const LiveVisitationContainer: React.FC<PropsFromRedux> = ({
  visitations,
  fetchCalls,
}) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [activeCallChatId, setActiveCallChatId] = useState<number>();
  const [messages, setMessages] = useState<CallMessage[]>([]);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [grid, setGrid] = useState<GridOption>(1);
  const [frameVhHeight, setFrameVhHeight] = useState(MAX_VH_HEIGHT_FRAMES);
  const [page, setPage] = useState(1);

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
    // setVisibleCalls(visitations.slice(0, grid));
    if (!activeCallChatId && visitations.length > 0) {
      setActiveCallChatId(visitations[0].id);
    }
  }, [grid, visitations, activeCallChatId]);

  useEffect(() => {
    const call = visitations.find((call) => call.id === activeCallChatId);
    setMessages(call?.messages || []);
  }, [activeCallChatId, visitations]);

  // Grid options
  const handleGridChange = (grid: GridOption) => {
    setGrid(grid);
    setFrameVhHeight(GRID_TO_VH_HEIGHT[grid]);
  };

  const onPageChange = (page: number, _?: number) => {
    setPage(page);
  };

  const onShowSizeChange = (_: number, pageSize: number) => {
    handleGridChange(pageSize as GridOption);
  };

  const onMessageReceived = useCallback(
    (callId: number, message: CallMessage) => {
      addMessage({ id: callId, message });
    },
    []
  );
  return (
    <Content>
      <Header
        title={`Live Calls (${visitations.length})`}
        subtitle="Monitor, send alerts and terminate calls if needed. All in real-time"
      />
      <Layout>
        <Content>
          <Space
            direction="vertical"
            style={{ ...FULL_WIDTH, ...WRAPPER_STYLE }}
          >
            {visitations.length > 0 && (
              <Pagination
                current={page}
                defaultCurrent={1}
                defaultPageSize={grid}
                onChange={onPageChange}
                pageSize={grid}
                pageSizeOptions={OPTIONS.filter(
                  (option) => option <= visitations.length
                ).map((e) => `${e}`)}
                total={visitations.length}
                showSizeChanger={true}
                onShowSizeChange={onShowSizeChange}
              />
            )}
            <Row gutter={16}>
              {visitations.map((visitation, idx) => (
                <Col span={GRID_TO_SPAN_WIDTH[grid]} key={visitation.id}>
                  {socket ? (
                    <VideoChat
                      height={`${frameVhHeight}vh`}
                      socket={socket}
                      callId={visitation.id}
                      participants={visitation.connection}
                      isVisible={
                        idx >= (page - 1) * grid &&
                        idx < (page - 1) * grid + grid
                      }
                      width="100%"
                      alerts={CALL_ALERTS}
                      muteCall={(callId: number) => {
                        setConsumeAudioRecord(
                          _.omit(consumeAudioRecord, callId)
                        );
                      }}
                      unmuteCall={(callId: number) =>
                        setConsumeAudioRecord({
                          ...consumeAudioRecord,
                          [callId]: true,
                        })
                      }
                      isAudioOn={visitation.id in consumeAudioRecord}
                      openChat={(callId: number) => {
                        const call = visitations.find(
                          (call) => call.id === callId
                        );
                        setActiveCallChatId(callId);
                        setMessages(call?.messages || []);
                        setChatCollapsed(false);
                      }}
                      closeChat={(callId: number) => {
                        setChatCollapsed(true);
                      }}
                      chatCollapsed={chatCollapsed}
                      addMessage={onMessageReceived}
                      lockCall={(callId: number) => {
                        const idx = visitations.findIndex(
                          (call) => call.id === callId
                        );
                        if (idx !== -1) {
                          handleGridChange(1);
                          setPage(idx + 1);
                        }
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
        <Sider
          theme="light"
          width={300}
          collapsible
          defaultCollapsed
          reverseArrow
          collapsed={chatCollapsed}
          onCollapse={(collapsed) => setChatCollapsed(collapsed)}
        >
          {!chatCollapsed && (
            <div>
              <PageHeader title="Chat" />{" "}
              <div style={WRAPPER_STYLE}>
                <Space
                  direction="vertical"
                  style={{
                    overflowY: "scroll",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {messages.map((message) => (
                    <MessageDisplay message={message} />
                  ))}
                </Space>
              </div>
            </div>
          )}
        </Sider>
      </Layout>
    </Content>
  );
};

export default connector(LiveVisitationContainer);
