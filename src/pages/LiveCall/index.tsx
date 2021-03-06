import React, { useState, useEffect, useRef } from "react";
import { RootState, useAppDispatch } from "src/redux";
import {
  CALL_ALERTS,
  GRID_TO_SPAN_WIDTH,
  GRID_TO_VH_HEIGHT,
} from "src/utils/constants";
import { FULL_WIDTH, WRAPPER_STYLE } from "src/styles/styles";
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
import { fetchCalls } from "src/redux/modules/call";
import VideoChat from "src/pages/LiveCall/VideoChat";
import VideoSkeleton from "./VideoSkeleton";
import { Call, CallMessage, GridOption } from "src/typings/Call";
import _ from "lodash";
import Header from "src/components/Header/Header";
import MessageDisplay from "src/components/calls/MessageDisplay";
import { useSelector } from "react-redux";
import {
  getCallContactsFullNames,
  getCallInmatesFullNames,
  getFirstNames,
} from "src/utils";
import { useCallsWithStatus } from "src/hooks/useCalls";
import { useContext } from "react";
import { LiveCallsContext } from "src/context/LiveCallsContext";

const { Content, Sider } = Layout;

const MAX_VH_HEIGHT_FRAMES = 80;
const OPTIONS: GridOption[] = [1, 2, 4, 6, 8];

const LiveVisitationContainer: React.FC = () => {
  const [activeCallChat, setActiveCallChat] = useState<Call>();
  const [activeMessages, setActiveMessages] = useState<CallMessage[]>([]);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [grid, setGrid] = useState<GridOption>(1);
  const [frameVhHeight, setFrameVhHeight] = useState(MAX_VH_HEIGHT_FRAMES);
  const [page, setPage] = useState(1);
  const messagesMap = useSelector((state: RootState) => state.calls.messages);

  const visitations = useCallsWithStatus("live");

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { roomClients, remoteAudios, remoteVideos } = useContext(
    LiveCallsContext
  );

  // map from call id to muted boolean
  const [unmutedCallsMap, setUnmutedCalls] = useState<Record<number, boolean>>(
    {}
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scroll({
      top: messagesContainerRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [messagesContainerRef, activeMessages]);

  useEffect(() => {
    dispatch(
      fetchCalls({
        "call.status": ["live"],
      })
    );
    const interval = setInterval(() => {
      dispatch(
        fetchCalls({
          "call.status": ["live"],
        })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Initialize call messages sider
  useEffect(() => {
    // if there are no calls at all, just return
    if (!visitations.length) return;
    //  if there are no active calls, just select the first one
    else if (!activeCallChat) {
      const initialActiveChat = visitations[0];
      setActiveCallChat(initialActiveChat);
      setActiveMessages(messagesMap[initialActiveChat.id] || []);
    } else {
      setActiveMessages(messagesMap[activeCallChat.id] || []);
    }
  }, [visitations, activeCallChat, messagesMap]);

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
                  (option) => option <= visitations.length + 1
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

                const rc = roomClients[call.id];
                if (!rc) return <div />;

                const videoStreams = remoteVideos[call.id] || {};
                const audioStreams = remoteAudios[call.id] || {};

                return (
                  <Col span={GRID_TO_SPAN_WIDTH[grid]} key={call.id}>
                    <VideoChat
                      height={`${frameVhHeight}vh`}
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
                      // addMessage={onMessageReceived}
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
                      rc={rc}
                      remoteVideos={videoStreams}
                      remoteAudios={audioStreams}
                      scheduledEnd={call.scheduledEnd}
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
          className="h-screen max-h-screen shadow overflow-y-auto"
        >
          {!chatCollapsed && (
            <div ref={messagesContainerRef} className="pb-16">
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
              <div
                className="flex flex-col"
                style={{
                  ...WRAPPER_STYLE,
                }}
                ref={messagesContainerRef}
              >
                {activeCallChat &&
                  activeMessages.map((message) => (
                    <MessageDisplay
                      message={message}
                      call={activeCallChat}
                      className="mt-4"
                    />
                  ))}
              </div>
            </div>
          )}
        </Sider>
      </Layout>
    </Content>
  );
};

export default LiveVisitationContainer;
