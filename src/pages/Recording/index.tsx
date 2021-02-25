import React, { ReactElement, useEffect, useState } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { fetchRecording } from "src/redux/modules/call";
import { getCallInfo } from "src/redux/selectors";
import { Button, Descriptions, Layout, PageHeader, Space } from "antd";
import ReactPlayer from "react-player";
import { WRAPPER_STYLE } from "src/styles/styles";
import { format } from "date-fns";
import { genFullName } from "src/utils";
import { DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { CallMessage, RecordedCall } from "src/typings/Call";
import { MessageDisplay } from "src/components/calls/MessageDisplay";

const { Content, Sider } = Layout;

const mapStateToProps = (
  state: RootState,
  ownProps: RouteComponentProps<TParams>
) => ({
  call: getCallInfo(state, parseInt(ownProps.match.params.id)) as RecordedCall,
});

const mapDispatchToProps = { fetchRecording };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TParams = { id: string };

function RecordingBase({
  call,
  match,
  fetchRecording,
}: PropsFromRedux & RouteComponentProps<TParams>): ReactElement {
  const [callId] = useState(match.params.id);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string>();
  const [messages, setMessages] = useState<CallMessage[]>([]);

  const facility = useSelector(
    (state: RootState) => state.facilities.selected?.name
  );

  useEffect(() => {
    // TODO what if data is not loaded
    if (call && !call.recordingUrl) {
      // TODO this can lead to infinite loops, add loaded flag to model
      fetchRecording(call.id);
    }
  }, [call, fetchRecording]);

  useEffect(() => {
    if (call?.recordingUrl) {
      setRecordingUrl(call.recordingUrl);
    }
    if (call?.messages) {
      setMessages(call.messages);
    }
  }, [call, setRecordingUrl]);

  const routes = [
    {
      path: "logs",
      breadcrumbName: "Logs",
    },
    {
      path: "call",
      breadcrumbName: `Call #${callId}`,
    },
  ];

  if (!call) return <div />;

  return (
    <Layout>
      <Content style={WRAPPER_STYLE}>
        <ReactPlayer
          autoplay={true}
          muted={true}
          controls={true}
          width="100%"
          url={"/recording_demo.mp4" || call.recordingUrl}
        />
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title={`Call #${callId}`}
          subTitle={facility}
          breadcrumb={{ routes }}
          extra={[
            <Button
              key="download"
              download
              target={"_blank"}
              icon={<DownloadOutlined />}
              href={recordingUrl}
            >
              Download
            </Button>,
            <Button
              key="info"
              onClick={() => console.log("add connection page")}
              icon={<InfoCircleOutlined />}
            >
              Connection
            </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="Incarcerated Person">
              {genFullName(call.connection.inmate)}
            </Descriptions.Item>
            <Descriptions.Item label="Inmate ID">
              {call.connection.inmate.id}
            </Descriptions.Item>
            <Descriptions.Item label="Visitor">
              {genFullName(call.connection.contact)}
            </Descriptions.Item>
            <Descriptions.Item label="Relationship">
              {call.connection.relationship}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {format(call.scheduledStartTime, "HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Start Time">
              {format(call.scheduledStartTime, "HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="End Time">
              {format(call.scheduledEndTime, "HH:mm")}
            </Descriptions.Item>
            {/* TODO add kiosk name once we incoporate the nodes endpoint */}
            <Descriptions.Item label="Location">
              Under the stairs
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </Content>
      <Sider
        theme="light"
        style={{ height: "100vh", maxHeight: "100vh" }}
        width={300}
        collapsible
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
  );
}

export default connector(RecordingBase);
