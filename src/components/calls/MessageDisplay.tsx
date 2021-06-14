import React, { useEffect, useState } from "react";
import { Space, Typography } from "antd";
import { format } from "date-fns";
import { Call, CallMessage, ParticipantType } from "src/typings/Call";
import { getCallContactsFullNames, getCallInmatesFullNames } from "src/utils";

interface Props {
  message: CallMessage;
  call: Call;
  className?: string;
}

const MessageDisplay: React.FC<Props> = ({ message, call, className }) => {
  const getDisplayName = () => {
    switch (message.senderType) {
      case "inmate":
        return getCallInmatesFullNames(call);

      case "user":
        return getCallContactsFullNames(call);
      case "doc":
        return "DOC Staff";
    }
  };

  return (
    <Space
      direction="vertical"
      align={message.senderType === "inmate" ? "end" : "start"}
      style={{ width: "100%" }}
      className={className}
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
