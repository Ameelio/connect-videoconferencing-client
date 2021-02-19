import React, { ReactElement } from "react";
import { Space, Typography } from "antd";
import { format } from "date-fns";
import { CallMessage } from "src/typings/Call";

export function MessageDisplay({
  message,
}: {
  message: CallMessage;
}): ReactElement {
  const type = message.from;
  const getDisplayName = () => {
    switch (type) {
      case "inmate":
        return "Inmate";
      case "monitor":
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
          {format(new Date(message.timestamp), "HH:mm")}
        </Typography.Text>
      </Space>
      <Typography.Text>{message.content}</Typography.Text>
    </Space>
  );
}
