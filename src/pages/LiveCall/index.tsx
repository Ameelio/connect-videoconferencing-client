import React, { useState, useEffect, useCallback } from "react";
import { RootState, useAppDispatch } from "src/redux";
import {
  CALL_ALERTS,
  GRID_TO_SPAN_WIDTH,
  GRID_TO_VH_HEIGHT,
} from "src/utils/constants";
import { FULL_WIDTH, WRAPPER_STYLE } from "src/styles/styles";
import io from "socket.io-client";
import { selectLiveCalls } from "src/redux/selectors";
import { Layout, Row, Col, Space, Pagination, PageHeader, Select } from "antd";
import { fetchCalls, callsActions } from "src/redux/modules/call";
import VideoChat from "src/pages/LiveCall/VideoChat";
import VideoSkeleton from "./VideoSkeleton";
import { CallMessage, GridOption } from "src/typings/Call";
import _ from "lodash";
import Header from "src/components/Header/Header";
import { MessageDisplay } from "src/components/calls/MessageDisplay";
import { connect, ConnectedProps } from "react-redux";

const { Content, Sider } = Layout;

const { addMessage } = callsActions;

const mapStateToProps = (state: RootState) => ({
  visitations: selectLiveCalls(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const MAX_VH_HEIGHT_FRAMES = 80;
const OPTIONS: GridOption[] = [1, 2, 4, 6, 8];

const LiveVisitationContainer: React.FC<PropsFromRedux> = ({ visitations }) => {
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

  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(
        fetchCalls({
          "call.status": ["live", "missing_monitor"],
        })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // TODO: this assumes all calls will have the same host. Gotta turn this into a Record<callId, handler>
    // https://github.com/Ameelio/connect-doc-client/issues/59
    if (!socket && visitations[0] && visitations[0].videoHandler) {
      setSocket(
        io.connect(
          `https://${visitations[0].videoHandler?.host}:${visitations[0].videoHandler?.port}` ||
            "localhost:8000"
          // { transports: ["websocket"] }
        )
      );
    }
  }, [setSocket, socket, visitations]);

  useEffect(() => {
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
                      inmates={visitation.inmates}
                      contacts={visitation.contacts}
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
                          setActiveCallChatId(idx);
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
              <PageHeader
                title="Chat"
                extra={[
                  <Select
                    value={activeCallChatId}
                    onSelect={(value) => setActiveCallChatId(value as number)}
                  >
                    {visitations.map((visitation) => (
                      <Select.Option value={visitation.id} key={visitation.id}>
                        Call #{visitation.id}
                      </Select.Option>
                    ))}
                  </Select>,
                ]}
              />{" "}
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
