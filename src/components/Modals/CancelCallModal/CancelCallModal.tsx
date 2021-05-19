import { Modal, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import { Call } from "src/typings/Call";
import { getCallContactsFullNames, getCallInmatesFullNames } from "src/utils";

interface Props {
  call: Call;
  cancelCall: (callId: string, reason: string) => void;
  closeModal: () => void;
}

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
      <Typography.Text>
        {" "}
        Please provide a reason for the cancellation so we can inform{" "}
        {getCallInmatesFullNames(call)} and {getCallContactsFullNames(call)}
      </Typography.Text>

      <TextArea
        rows={3}
        onChange={(e) => setReason(e.target.value)}
        value={reason}
      />
    </Modal>
  );
};

export default CancelCallModal;
