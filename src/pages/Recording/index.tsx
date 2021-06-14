import React, { ReactElement, useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { getCallInfo, selectMessageByCallId } from "src/redux/selectors";
import { Button, Descriptions, Layout, PageHeader, Space } from "antd";
import ReactPlayer from "react-player";
import { WRAPPER_STYLE } from "src/styles/styles";
import { format } from "date-fns";
import {
  genFullName,
  getCallContactsFullNames,
  getVisitationLabel,
} from "src/utils";
import { DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Call } from "src/typings/Call";
import MessageDisplay from "src/components/calls/MessageDisplay";
import { fetchCallMessages } from "src/redux/modules/call";
import { VisitationType } from "src/typings/Common";

const { Content, Sider } = Layout;

const mapStateToProps = (
  state: RootState,
  ownProps: RouteComponentProps<TParams>
) => ({
  call: getCallInfo(state, ownProps.match.params.id) as Call,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TParams = { id: string };

function RecordingBase({
  call,
  match,
}: PropsFromRedux & RouteComponentProps<TParams>): ReactElement {
  const [callId] = useState(match.params.id);
  const [chatCollapsed, setChatCollapsed] = useState(false);

  const facility = useSelector(
    (state: RootState) => state.facilities.selected?.name
  );

  const messages = useSelector((state: RootState) =>
    selectMessageByCallId(state, callId)
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (callId) dispatch(fetchCallMessages(callId));
  }, [callId, dispatch]);

  if (!call) return <div />;

  return (
    <Layout>
      <Content style={WRAPPER_STYLE}>
        {call.type === VisitationType.FAMILY_VIDEO_CALL && (
          <ReactPlayer
            autoplay={true}
            muted={true}
            controls={true}
            width="100%"
            url={call.recordingPath || "/recording_demo.mp4"}
          />
        )}
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title={`${getVisitationLabel(call.type)} #${callId}`}
          subTitle={facility}
          extra={[
            <Button
              key="download"
              download
              target={"_blank"}
              icon={<DownloadOutlined />}
              href={call.recordingPath}
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
          <Descriptions size="small" column={3} bordered layout="vertical">
            <Descriptions.Item label="Visitation ID">
              {call.id}
            </Descriptions.Item>
            <Descriptions.Item label="Incarcerated Person">
              {call.inmates.map((inmate) => genFullName(inmate))}
            </Descriptions.Item>
            <Descriptions.Item label="Inmate ID">
              {call.inmates.map((inmate) => inmate.inmateIdentification)}
            </Descriptions.Item>
            <Descriptions.Item label="Visitor (s)">
              {getCallContactsFullNames(call)}
            </Descriptions.Item>

            <Descriptions.Item label="Date">
              {format(new Date(call.scheduledStart), "MM/dd/yyyy")}
            </Descriptions.Item>
            <Descriptions.Item label="Start Time">
              {format(new Date(call.scheduledStart), "HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="End Time">
              {format(new Date(call.scheduledEnd), "HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Kiosk">
              {call.kiosk.name}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {getVisitationLabel(call.type)}
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
                  <MessageDisplay message={message} call={call} />
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
