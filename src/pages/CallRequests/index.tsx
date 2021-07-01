import React, { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "src/redux";
import { CallRequests } from "src/components/Requests";
import { useCallsWithStatus } from "src/hooks/useCalls";
import { Call, CallStatus } from "src/typings/Call";
import { fetchCalls, updateCallStatus } from "src/redux/modules/call";
import { push } from "connected-react-router";
import Header from "src/components/Header";
import { Layout } from "antd";
import { WRAPPER_STYLE } from "src/styles/styles";
import { openModal } from "src/redux/modules/modal";
import { DEFAULT_CALL_REJECTION_REASONS } from "src/constants";

const CallRequestsPage: React.FC = () => {
  const calls = useCallsWithStatus("pending_approval");

  const dispatch = useAppDispatch();

  const loading = useAppSelector((state: RootState) => state.calls.loading);

  const handleCallUpdate = (call: Call, status: CallStatus): void => {
    dispatch(updateCallStatus({ id: call.id, status }));
  };

  useEffect(() => {
    dispatch(fetchCalls({ status: "pending_approval" }));
  }, [dispatch]);

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
          reject={(call: Call) =>
            dispatch(
              openModal({
                activeType: "CANCEL_CALL_MODAL",
                entity: call,
                reasons: DEFAULT_CALL_REJECTION_REASONS,
                cancellationType: "rejected",
              })
            )
          }
          navigate={(path: string) => dispatch(push(path))}
          loading={loading}
        />
      </div>
    </Layout.Content>
  );
};

export default CallRequestsPage;
