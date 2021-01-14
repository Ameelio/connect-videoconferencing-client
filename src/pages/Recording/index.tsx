import React, { ReactElement, useEffect, useState } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { fetchCalls, fetchRecording } from "src/redux/modules/call";
import { selectCallById } from "src/redux/selectors";
import { Breadcrumb, Layout } from "antd";
import ReactPlayer from "react-player";
import PageLoader from "src/components/loaders/PageLoader";
import { WRAPPER_STYLE } from "src/utils/constants";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = { fetchRecording };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TParams = { id: string };

function RecordingBase({
  match,
  fetchRecording,
}: PropsFromRedux & RouteComponentProps<TParams>): ReactElement {
  const [callId] = useState(match.params.id);

  const call = useSelector((state: RootState) =>
    selectCallById(state, callId)
  ) as RecordedVisitation;

  useEffect(() => {
    if (call?.videoReady && !call.recordingUrl) {
      fetchRecording(parseInt(callId));
    }
  }, [callId, call, fetchRecording]);

  // if (!call?.recordingUrl) return <PageLoader />;

  return (
    <Content style={WRAPPER_STYLE}>
      {/* TODO add more Breadcrumb items once we fetch all nodes for a facility */}
      <Breadcrumb>
        <Breadcrumb.Item>Logs</Breadcrumb.Item>
        <Breadcrumb.Item>Call #{callId}</Breadcrumb.Item>
      </Breadcrumb>
      <ReactPlayer
        autoplay={true}
        muted={true}
        controls={true}
        url={
          call.recordingUrl ||
          "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
        }
      />
    </Content>
  );
}

export default connector(RecordingBase);
