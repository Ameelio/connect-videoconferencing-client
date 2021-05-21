import { Modal, Space, Tag, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import { Call } from "src/typings/Call";
import { getCallContactsFullNames, getCallInmatesFullNames } from "src/utils";

interface Props {
  call: Call;
  cancelCall: (callId: string, reason: string) => void;
  closeModal: () => void;
}

const DEFAULT_CANCELLATION_REASONS = [
  {
    title: "Storm/Severe Weather",
    description:
      "Due to the risk of severe weather, we'll have to cancel all visitation appointments for today.",
    key: "storm",
  },
  {
    title: "Lockdown",
    description:
      "ICIW is on lockdown. We're very sorry to inform all visitations have been cancelled.",
    key: "lockdown",
  },
];

const CancelCallModal = ({ call, cancelCall, closeModal }: Props) => {
  const [reason, setReason] = useState("");
  return (
    <Modal
      title={`Cancel call ${call.id}?`}
      onOk={() => {
        cancelCall(call.id, reason);
        closeModal();
      }}
      onCancel={closeModal}
      okText="Confirm"
      visible={true}
    >
      <Space direction="vertical">
        <Typography.Text>
          {" "}
          Please provide a reason for the cancellation so we can inform{" "}
          {getCallInmatesFullNames(call)} and {getCallContactsFullNames(call)}:
        </Typography.Text>

        <TextArea
          rows={3}
          onChange={(e) => setReason(e.target.value)}
          value={reason}
        />
        <Space>
          <Typography.Text>Common Reasons:</Typography.Text>
          {DEFAULT_CANCELLATION_REASONS.map((reason) => (
            <Tag key={reason.key} onClick={() => setReason(reason.description)}>
              {reason.title}
            </Tag>
          ))}
        </Space>
      </Space>
    </Modal>
  );
};

export default CancelCallModal;
