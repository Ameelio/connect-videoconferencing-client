import React from "react";
import { useAppDispatch } from "src/redux";
import { updateConnection } from "src/redux/modules/connections";
import {
  BaseConnection,
  Connection,
  ConnectionStatus,
} from "src/typings/Connection";
import Requests from "src/components/Requests";
import { usePendingCalls } from "src/hooks/useCalls";
import { Call, CallStatus } from "src/typings/Call";
import { updateCallStatus } from "src/redux/modules/call";
import { useConnectionRequests } from "src/hooks/useConnections";

const RequestsPage: React.FC = () => {
  const calls = usePendingCalls();
  const connections = useConnectionRequests();

  const dispatch = useAppDispatch();

  const handleConnectionUpdate = (
    request: BaseConnection,
    status: ConnectionStatus
  ): void => {
    dispatch(updateConnection({ connectionId: request.id, status }));
  };

  const handleCallUpdate = (call: Call, status: CallStatus): void => {
    dispatch(updateCallStatus({ id: call.id, status: "scheduled" }));
  };

  return (
    <Requests
      calls={calls}
      acceptCall={(call: Call) => handleCallUpdate(call, "scheduled")}
      rejectCall={(call: Call) => handleCallUpdate(call, "cancelled")}
      acceptConnection={(connection: Connection) =>
        handleConnectionUpdate(connection, "active")
      }
      rejectConnection={(connection: Connection) =>
        handleConnectionUpdate(connection, "rejected")
      }
      connections={connections}
    />
  );
};

export default RequestsPage;
