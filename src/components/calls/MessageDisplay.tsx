import React, { ReactElement } from "react";
import { Space, Typography } from "antd";
import { format } from "date-fns";
import { CallMessage } from "src/typings/Call";

export function MessageDisplay({
  message,
}: {
  message: CallMessage;
}): ReactElement {
  const type = message.senderType;
  const getDisplayName = () => {
    switch (type) {
      case "inmate":
        return "Incarcerated Person";
      case "doc":
        return "DOC";
      case "user":
        return "Loved One";
    }
  };
  return (
    <Space
      direction="vertical"
      align={type === "inmate" ? "end" : "start"}
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
}
