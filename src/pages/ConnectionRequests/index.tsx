import React from "react";
import { useAppDispatch } from "src/redux";
import { updateConnection } from "src/redux/modules/connections";
import {
  BaseConnection,
  Connection,
  ConnectionStatus,
} from "src/typings/Connection";
import { useConnectionRequests } from "src/hooks/useConnections";
import { push } from "connected-react-router";
import ConnectionRequests from "src/components/Requests/ConnectionRequests";
import { Layout } from "antd";
import Header from "src/components/Header";
import { WRAPPER_STYLE } from "src/styles/styles";

const RequestsPage: React.FC = () => {
  const connections = useConnectionRequests();

  const dispatch = useAppDispatch();

  const handleConnectionUpdate = (
    request: BaseConnection,
    status: ConnectionStatus
  ): void => {
    dispatch(updateConnection({ connectionId: request.id, status }));
  };

  return (
    <Layout.Content>
      <Header
        title="Approval Requests"
        subtitle="Review all connection requests between incarcerated people in your facility and their loved one on the outside."
      />
      <div style={WRAPPER_STYLE}>
        <ConnectionRequests
          accept={(connection: Connection) =>
            handleConnectionUpdate(connection, "active")
          }
          reject={(connection: Connection) =>
            handleConnectionUpdate(connection, "rejected")
          }
          connections={connections}
          navigate={(path: string) => dispatch(push(path))}
        />
      </div>
    </Layout.Content>
  );
};

export default RequestsPage;
