import React, { ReactElement, useEffect, useState } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { fetchCalls, fetchRecording } from "src/redux/modules/call";
import { getCallInfo } from "src/redux/selectors";
import {
  Breadcrumb,
  Button,
  Descriptions,
  Layout,
  PageHeader,
  Row,
  Space,
} from "antd";
import ReactPlayer from "react-player";
import { WRAPPER_STYLE } from "src/utils/constants";
import { format } from "date-fns";
import { genFullName } from "src/utils/utils";
import { DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { RecordedCall } from "src/typings/Call";

const { Content } = Layout;

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

  const facility = useSelector(
    (state: RootState) => state.facilities.selected?.name
  );

  useEffect(() => {
    if (call && call?.videoReady && !call.recordingUrl) {
      fetchRecording(parseInt(callId));
    }
  }, [callId, call, fetchRecording]);

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
    <Content style={WRAPPER_STYLE}>
      {/* TODO add more Breadcrumb items once we fetch all nodes for a facility */}
      <Space direction="vertical" align="center" size="large">
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
              href={
                call.recordingUrl ||
                "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
              }
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
              {format(call.startTime, "HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Start Time">
              {format(call.startTime, "HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="End Time">
              {format(call.endTime, "HH:mm")}
            </Descriptions.Item>
            {/* TODO add kiosk name once we incoporate the nodes endpoint */}
            <Descriptions.Item label="Location">
              Under the stairs
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <ReactPlayer
          autoplay={true}
          muted={true}
          controls={true}
          url={
            call.recordingUrl ||
            "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
          }
        />
      </Space>
    </Content>
  );
}

export default connector(RecordingBase);
