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
import {
  Layout,
  Row,
  Col,
  Space,
  Pagination,
  PageHeader,
  Select,
  Empty,
} from "antd";
import {
  fetchCalls,
  callsActions,
  updateCallStatus,
} from "src/redux/modules/call";
import VideoChat from "src/pages/LiveCall/VideoChat";
import VideoSkeleton from "./VideoSkeleton";
import { Call, CallMessage, CallStatus, GridOption } from "src/typings/Call";
import _ from "lodash";
import Header from "src/components/Header/Header";
import MessageDisplay from "src/components/calls/MessageDisplay";
import { connect, ConnectedProps } from "react-redux";
import {
  getCallContactsFullNames,
  getCallInmatesFullNames,
  getFirstNames,
  getVideoHandlerHostname,
} from "src/utils";

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
  const [activeCallChat, setActiveCallChat] = useState<Call>();
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [grid, setGrid] = useState<GridOption>(1);
  const [frameVhHeight, setFrameVhHeight] = useState(MAX_VH_HEIGHT_FRAMES);
  const [page, setPage] = useState(1);
  const [freshCalls, setFreshCalls] = useState<Call[]>([]);

  // map from video handler hostname to socket
  const [socketMap, setSocketMap] = useState<
    Record<string, SocketIOClient.Socket>
  >({});

  // map from call id to muted boolean
  const [unmutedCallsMap, setUnmutedCalls] = useState<Record<number, boolean>>(
    {}
  );

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
    const newCalls = visitations.filter(
      (call) =>
        call.videoHandler &&
        !(getVideoHandlerHostname(call.videoHandler) in socketMap)
    );
    setFreshCalls(newCalls);
  }, [socketMap, visitations]);

  useEffect(() => {
    if (!freshCalls.length) return;

    const temp: Record<string, SocketIOClient.Socket> = {};

    for (const call of freshCalls) {
      if (!call.videoHandler) continue;
      const target = getVideoHandlerHostname(call.videoHandler);
      // initialize new sockets once
      if (target in temp) continue;

      // TODO: change this quick hack once we integrate @bporter's neat Kubernetes
      // https://github.com/Ameelio/connect-doc-client/issues/73
      const newSocketClient = io.connect(
        process.env.NODE_ENV === "production"
          ? `https://${call.videoHandler.host}`
          : target,
        { transports: ["websocket"] }
      );
      temp[target] = newSocketClient;
    }
    console.log("[Index] New socket clients", temp);
    setSocketMap((curr) => ({ ...curr, ...temp }));
  }, [freshCalls]);

  // Initialize call messages
  useEffect(() => {
    if (!activeCallChat && visitations.length > 0) {
      setActiveCallChat(visitations[0]);
    }
  }, [visitations, activeCallChat]);

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
    (callId: string, message: CallMessage) => {
      dispatch(addMessage({ id: callId, message }));
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
            {visitations.length === 0 && (
              <Empty description="There aren't any live calls currently." />
            )}
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
              {visitations.map((call, idx) => {
                if (!call.videoHandler)
                  return (
                    <Col span={GRID_TO_SPAN_WIDTH[grid]} key={call.id}>
                      <VideoSkeleton
                        width="100%"
                        height={`${frameVhHeight}vh`}
                      />
                    </Col>
                  );

                const socket =
                  socketMap[getVideoHandlerHostname(call.videoHandler)];

                if (!socket) return <div />;
                return (
                  <Col span={GRID_TO_SPAN_WIDTH[grid]} key={call.id}>
                    <VideoChat
                      height={`${frameVhHeight}vh`}
                      socket={socket}
                      callId={call.id}
                      participantNames={{
                        inmates: getCallInmatesFullNames(call),
                        contacts: getCallContactsFullNames(call),
                      }}
                      isVisible={
                        idx >= (page - 1) * grid &&
                        idx < (page - 1) * grid + grid
                      }
                      width="100%"
                      alerts={CALL_ALERTS}
                      muteCall={(callId: string) =>
                        setUnmutedCalls(_.omit(unmutedCallsMap, callId))
                      }
                      unmuteCall={(callId: string) =>
                        setUnmutedCalls({
                          ...unmutedCallsMap,
                          [callId]: true,
                        })
                      }
                      isAudioOn={call.id in unmutedCallsMap}
                      openChat={(callId: string) => {
                        const call = visitations.find(
                          (call) => call.id === callId
                        );
                        setActiveCallChat(call);
                        setChatCollapsed(false);
                      }}
                      closeChat={(callId: string) => {
                        setChatCollapsed(true);
                      }}
                      chatCollapsed={chatCollapsed}
                      addMessage={onMessageReceived}
                      lockCall={(callId: string) => {
                        const idx = visitations.findIndex(
                          (call) => call.id === callId
                        );
                        if (idx !== -1) {
                          handleGridChange(1);
                          setPage(idx + 1);
                          setActiveCallChat(visitations[idx]);
                        }
                      }}
                      updateCallStatus={(id: string, status: CallStatus) =>
                        dispatch(updateCallStatus({ id, status }))
                      }
                    />
                  </Col>
                );
              })}
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
            <div className="h-screen">
              <PageHeader
                title="Chat"
                extra={[
                  <Select
                    value={activeCallChat?.id}
                    onSelect={(id) => {
                      setActiveCallChat(visitations.find((v) => v.id === id));
                    }}
                  >
                    {visitations.map((visitation) => (
                      <Select.Option
                        value={visitation.id}
                        key={visitation.id}
                        className="truncate mw-1/2"
                      >
                        {getFirstNames(visitation.inmates)} &{" "}
                        {getFirstNames(visitation.contacts)}
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
                  {activeCallChat?.messages.map((message) => (
                    <MessageDisplay message={message} call={activeCallChat} />
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
