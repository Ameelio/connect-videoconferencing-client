import React from "react";
import { useAppDispatch } from "src/redux";
import { CallRequests } from "src/components/Requests";
import { useCallsWithStatus } from "src/hooks/useCalls";
import { Call, CallStatus } from "src/typings/Call";
import { updateCallStatus } from "src/redux/modules/call";
import { push } from "connected-react-router";
import Header from "src/components/Header";
import { Layout } from "antd";
import { WRAPPER_STYLE } from "src/styles/styles";

const CallRequestsPage: React.FC = () => {
  const calls = useCallsWithStatus("pending_approval");

  const dispatch = useAppDispatch();

  const handleCallUpdate = (call: Call, status: CallStatus): void => {
    dispatch(updateCallStatus({ id: call.id, status }));
  };

  return (
    <Layout.Content>
      <Header
        title="Approval Requests"
        subtitle="Review all connection requests between incarcerated people in your facility and their loved one on the outside."
      />
      <div style={WRAPPER_STYLE}>
        <CallRequests
          calls={calls}
          accept={(call: Call) => handleCallUpdate(call, "scheduled")}
          reject={(call: Call) => handleCallUpdate(call, "rejected")}
          navigate={(path: string) => dispatch(push(path))}
        />
      </div>
    </Layout.Content>
  );
};

export default CallRequestsPage;
