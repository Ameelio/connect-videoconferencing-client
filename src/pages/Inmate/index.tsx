import React, { ReactElement } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import {
  getCallsInfo,
  selectInmateById,
  selectInmateCallsById,
  selectInmateConnectionsById,
} from "src/redux/selectors";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Layout,
  PageHeader,
  Row,
  Space,
  Timeline,
  Typography,
} from "antd";
import { WRAPPER_STYLE } from "src/styles/styles";
import { format } from "date-fns";
import { genFullName } from "src/utils";
import { push } from "connected-react-router";
import { Call } from "src/typings/Call";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Content } = Layout;

type TParams = { id: string };

const mapStateToProps = (
  state: RootState,
  ownProps: RouteComponentProps<TParams>
) => ({
  inmate: selectInmateById(state, parseInt(ownProps.match.params.id)),
  connections:
    selectInmateConnectionsById(state, parseInt(ownProps.match.params.id)) ||
    [],
  calls: getCallsInfo(
    state,
    selectInmateCallsById(state, parseInt(ownProps.match.params.id)) || []
  ),
});

const mapDispatchToProps = { push };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const renderItem = (call: Call) => {
  // TODO timestamp should probably be different her
  const timestamp = format(call.scheduledStartTime, "MM/dd HH:mm");
  switch (call.status) {
    case "scheduled":
      return (
        <Timeline.Item label={timestamp} color="yellow">
          Call scheduled with {genFullName(call.connection.contact)}
        </Timeline.Item>
      );
    case "cancelled":
      return (
        <Timeline.Item label={timestamp} color="red">
          Call with {genFullName(call.connection.contact)} was cancelled
        </Timeline.Item>
      );
    case "missing-monitor":
    case "live":
      return (
        <Timeline.Item label={timestamp} color="green">
          Call happening with {genFullName(call.connection.contact)}
        </Timeline.Item>
      );
    case "terminated":
    case "ended":
      return call.videoReady ? (
        <Timeline.Item label={format(call.scheduledStartTime, "MM/dd HH:mm")}>
          {/* expand this to include other cases */}
          <Typography.Link onClick={() => push(`/call/${call.id}`)}>
            Called {genFullName(call.connection.contact)}
          </Typography.Link>
        </Timeline.Item>
      ) : (
        <Timeline.Item
          dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
          label={timestamp}
        >
          {/* expand this to include other cases */}
          <Typography.Link onClick={() => push(`/call/${call.id}`)}>
            Processsing call with {genFullName(call.connection.contact)}
          </Typography.Link>
        </Timeline.Item>
      );
  }
};

function InmateUnconnectedContainer({
  inmate,
  connections,
  calls,
  push,
}: PropsFromRedux & RouteComponentProps<TParams>): ReactElement {
  const facility = useSelector(
    (state: RootState) => state.facilities.selected?.name
  );

  if (!inmate || !facility) return <div />;

  const routes = [
    {
      path: "/",
      breadcrumbName: facility,
    },
    {
      path: "/members",
      breadcrumbName: "Logs",
    },
    {
      path: "/",
      breadcrumbName: genFullName(inmate),
    },
  ];

  return (
    <Layout>
      <Content style={{ ...WRAPPER_STYLE }}>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title={genFullName(inmate)}
          subTitle={facility}
          breadcrumb={{ routes }}
          style={{ marginBottom: 32 }}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="First Name">
              {inmate.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {inmate.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Unique ID">
              {inmate.inmateNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {inmate.location}
            </Descriptions.Item>
            <Descriptions.Item label="DOB">{inmate.dob}</Descriptions.Item>
            <Descriptions.Item label="Race">{inmate.race}</Descriptions.Item>
            <Descriptions.Item label="Sentence">
              {inmate.sentence}
            </Descriptions.Item>
            <Descriptions.Item label="Sentence Length">
              {inmate.sentnceLength}
            </Descriptions.Item>
            <Descriptions.Item label="Call Quota">
              {inmate.quota}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <Row justify="space-between" gutter={12}>
          <Col span={12}>
            <Card title="Call Activity">
              {!calls.length && <Typography.Text>No calls.</Typography.Text>}
              <Timeline mode={"left"}>{calls.map(renderItem)}</Timeline>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Connections">
              <Row justify="space-between">
                {!connections.length && (
                  <Typography.Text>No connections.</Typography.Text>
                )}
                {connections.map((connection) => (
                  <Col span={8}>
                    <Space direction="vertical" align="center">
                      <Avatar
                        src={connection.contact.profileImagePath}
                        size={80}
                      />
                      <Typography.Text>
                        {genFullName(connection.contact)}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {connection.relationship}
                      </Typography.Text>
                    </Space>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default connector(InmateUnconnectedContainer);
