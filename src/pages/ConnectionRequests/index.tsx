import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { WRAPPER_STYLE } from "src/styles/styles";
import {
  selectAllConnectionInfo,
  selectConnectionRequests,
} from "src/redux/selectors";
import { Table, Space, Layout, Avatar, Button } from "antd";
import { genFullName } from "src/utils";
import { updateConnection } from "src/redux/modules/connections";
import { BaseConnection, Connection } from "src/typings/Connection";
import Header from "src/components/Header/Header";

const { Column } = Table;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  requests: selectAllConnectionInfo(state, selectConnectionRequests(state)),
});

const mapDispatchToProps = { updateConnection };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const ConnectionRequestsContainer: React.FC<PropsFromRedux> = ({
  updateConnection,
  requests,
}) => {
  const handleAccept = (request: BaseConnection): void => {
    updateConnection({ connectionId: request.id, status: "approved" });
  };

  const handleDecline = (request: BaseConnection): void => {
    updateConnection({ connectionId: request.id, status: "denied" });
  };

  return (
    <Content>
      <Header
        title="Approval Requests"
        subtitle="Review all connection requests between incarcerated people in your facility and their loved one on the outside."
      />
      <Table dataSource={requests} style={WRAPPER_STYLE}>
        <Column
          title=""
          dataIndex="inmate"
          key="inmateProfilePic"
          render={(inmate: Inmate) => (
            <>
              {
                <Avatar
                  src={inmate.profileImagePath}
                  shape="circle"
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                />
              }
            </>
          )}
        />
        <Column
          title="Inmate"
          dataIndex="inmate"
          key="inmateProfilePic"
          render={(inmate: Inmate) => (
            <>
              <Space direction="vertical">
                <span>{genFullName(inmate)}</span>
                <span>{inmate.inmateNumber}</span>
                {/* <span>{format(new Date(inmate.dob), "DD/mm/yy")}</span> */}
                <span>{inmate.location}</span>
              </Space>
            </>
          )}
        />
        <Column
          title=""
          dataIndex="contact"
          key="contactProfilePic"
          render={(contact: Contact) => (
            <>
              <Avatar
                src={contact.profileImagePath}
                shape="circle"
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              />
            </>
          )}
        />
        <Column
          title="Contact"
          dataIndex="contact"
          key="contactInfo"
          render={(contact: Contact) => (
            <>
              <Space direction="vertical">
                <span>{genFullName(contact)}</span>
                <span>Visitor ID: {contact.id}</span>
                <span>{contact.relationship}</span>
              </Space>
            </>
          )}
        />
        <Column
          title=""
          key="actions"
          render={(_text, request: Connection) => (
            <Space>
              <Button type="primary" onClick={() => handleAccept(request)}>
                Accept
              </Button>
              <Button danger onClick={() => handleDecline(request)}>
                Reject
              </Button>
            </Space>
          )}
        />
      </Table>
    </Content>
  );
};

export default connector(ConnectionRequestsContainer);
