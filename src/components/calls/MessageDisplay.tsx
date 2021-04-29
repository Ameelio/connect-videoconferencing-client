import React, { useEffect, useState } from "react";
import { Space, Typography } from "antd";
import { format } from "date-fns";
import { Call, CallMessage, ParticipantType } from "src/typings/Call";
import { getCallContactsFullNames, getCallInmatesFullNames } from "src/utils";

interface Props {
  message: CallMessage;
  call: Call;
}

const MessageDisplay: React.FC<Props> = ({ message, call }) => {
  const [senderType, setSenderType] = useState<ParticipantType>();

  useEffect(() => {
    const personId = message.senderId;

    if (call.inmates.some((i) => i.personId === personId)) {
      setSenderType("inmate");
    } else if (call.contacts.some((c) => c.personId === personId)) {
      setSenderType("user");
    } else {
      setSenderType("doc");
    }
  }, [message, call]);

  const getDisplayName = () => {
    switch (senderType) {
      case "inmate":
        return getCallInmatesFullNames(call);
      case "doc":
        return "DOC Staff";
      case "user":
        return getCallContactsFullNames(call);
    }
  };

  return (
    <Space
      direction="vertical"
      align={senderType === "inmate" ? "end" : "start"}
      style={{ width: "100%" }}
    >
      <Space>
        <Typography.Text strong>{getDisplayName()}</Typography.Text>
        <Typography.Text type="secondary">
          {format(new Date(message.createdAt), "HH:mm")}
        </Typography.Text>
      </Space>
      <Typography.Text>{message.contents}</Typography.Text>
    </Space>
  );
};

export default MessageDisplay;
