import { ClockCircleOutlined } from "@ant-design/icons";
import { Timeline, Typography } from "antd";
import { format } from "date-fns";
import React from "react";
import { Call } from "src/typings/Call";
import { MemberType } from "src/typings/Common";
import { getCallContactsFullNames, getCallInmatesFullNames } from "src/utils";

interface Props {
  type: MemberType;
  call: Call;
  navigate: (path: string) => void;
}

export const CallTimelineItem = ({ call, type, navigate }: Props) => {
  const renderItem = () => {
    const names = (
      <Typography.Text strong>
        {type === "inmate"
          ? getCallContactsFullNames(call)
          : getCallInmatesFullNames(call)}
      </Typography.Text>
    );

    const timestamp = format(new Date(call.scheduledStart), "MM/dd HH:mm");

    switch (call.status) {
      case "pending_approval":
        return (
          <Timeline.Item label={timestamp} color="yellow">
            Call with {names} is pending approval
          </Timeline.Item>
        );
      case "scheduled":
        return (
          <Timeline.Item label={timestamp} color="yellow">
            Call scheduled with {names}
          </Timeline.Item>
        );
      case "cancelled":
        return (
          <Timeline.Item label={timestamp} color="red">
            Call with {names} was cancelled
          </Timeline.Item>
        );
      case "no_show":
        return (
          <Timeline.Item label={timestamp} color="red">
            Did not show up for call with {names}
          </Timeline.Item>
        );
      case "missing_monitor":
      case "live":
        return (
          <Timeline.Item label={timestamp} color="green">
            Call happening with {names}
          </Timeline.Item>
        );
      case "terminated":
      case "ended":
        return call.recordingStatus === "done" ? (
          <Timeline.Item
            label={format(new Date(call.scheduledStart), "MM/dd HH:mm")}
          >
            {/* expand this to include other cases */}
            <Typography.Link onClick={() => navigate(`/call/${call.id}`)}>
              Called {names}
            </Typography.Link>
          </Timeline.Item>
        ) : (
          <Timeline.Item
            dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
            label={timestamp}
          >
            {/* expand this to include other cases */}
            <Typography.Link onClick={() => navigate(`/call/${call.id}`)}>
              Processsing call with {names}
            </Typography.Link>
          </Timeline.Item>
        );
      default:
        return <div />;
    }
  };

  return renderItem();
};
