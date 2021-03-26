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
import { Inmate } from "src/typings/Inmate";
import { format } from "date-fns";
import { Contact } from "src/typings/Contact";

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
                  size={64}
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
                <span>{inmate.inmateIdentification}</span>
                <span>{format(new Date(inmate.dateOfBirth), "dd/mm/yy")}</span>
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
              <Avatar src={contact.profileImagePath} shape="circle" size={64} />
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
              </Space>
            </>
          )}
        />
        <Column
          title="Relationship"
          dataIndex="relationship"
          key="relationship"
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
