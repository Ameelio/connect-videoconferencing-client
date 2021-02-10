import { message, notification } from "antd";

export const openNotificationWithIcon = (
  message: string,
  description: string,
  type: "success" | "info" | "error" | "warning"
) => {
  notification[type]({
    message,
    description,
  });
};

export const showToast = (
  key: string,
  content: string,
  type: "success" | "error" | "warning" | "loading" | "info",
  duration = 3
) => {
  switch (type) {
    case "success":
      message.success({ content, key, duration });
      break;
    case "error":
      message.error({ content, key, duration });
      break;
    case "warning":
      message.warning({ content, key, duration });
      break;
    case "loading":
      message.loading({ content, key, duration });
      break;
    default:
      message.info({ content, key, duration });
      break;
  }
};
