import React, { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "src/redux";
import {
  fetchConnections,
  updateConnection,
} from "src/redux/modules/connections";
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
import { openModal } from "src/redux/modules/modal";
import { DEFAULT_CONNECTION_REJECTION_REASONS } from "src/constants";

const RequestsPage: React.FC = () => {
  const connections = useConnectionRequests();

  const dispatch = useAppDispatch();
  const loading = useAppSelector(
    (state: RootState) => state.connections.loading
  );

  const handleConnectionUpdate = (
    request: BaseConnection,
    status: ConnectionStatus
  ): void => {
    dispatch(updateConnection({ connectionId: request.id, status }));
  };

  useEffect(() => {
    // TODO: improve to only re-fetch connection requests here
    dispatch(fetchConnections());
  }, [dispatch]);

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
            dispatch(
              openModal({
                activeType: "CANCEL_CONNECTION_MODAL",
                entity: connection,
                reasons: DEFAULT_CONNECTION_REJECTION_REASONS,
                cancellationType: "rejected",
              })
            )
          }
          connections={connections}
          navigate={(path: string) => dispatch(push(path))}
          loading={loading}
        />
      </div>
    </Layout.Content>
  );
};

export default RequestsPage;
