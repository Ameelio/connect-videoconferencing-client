import React, { useEffect, useState } from "react";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/redux";
import {
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
} from "src/redux/modules/connection_requests";
import { PADDING } from "src/utils/constants";
import ConnectionRequestCard from "./ConnectionRequestCard";
import { WithLoading } from "src/components/hocs/WithLoadingProps";
import { getConnectionRequests } from "src/api/Connection";
import {
  selectInmateById,
  getAllConnectionsInfo,
  selectConnectionRequests,
} from "src/redux/selectors";
import { Table, Tag, Space, Layout, Avatar, Button } from "antd";
import { format } from "date-fns";
import { genFullName } from "src/utils/utils";
import { updateConnection } from "src/redux/modules/connections";

const { Column } = Table;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  requests: getAllConnectionsInfo(state, selectConnectionRequests(state)),
});

const mapDispatchToProps = { updateConnection };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const ConnectionRequestWithLoading = WithLoading(ConnectionRequestCard);

const ConnectionRequestsContainer: React.FC<PropsFromRedux> = ({
  updateConnection,
  requests,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleAccept = (request: BaseConnection): void => {
    updateConnection({ connectionId: request.id, status: "approved" });
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
    }, 3000);
  };

  const handleDecline = (request: BaseConnection): void => {
    updateConnection({ connectionId: request.id, status: "denied" });
  };

  useEffect(() => {
    //TODO, replace this with loading logic
    getConnectionRequests();
  }, []);

  return (
    <Content style={{ padding: PADDING }}>
      <Table dataSource={requests}>
        <Column
          title=""
          dataIndex="inmate"
          key="inmateProfilePic"
          render={(inmate: Inmate) => (
            <>
              {
                <Avatar
                  src={inmate.profileImgPath}
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
                src={contact.profileImgPath}
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
