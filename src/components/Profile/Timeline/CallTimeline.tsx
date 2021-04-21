import { Card, Empty, Timeline } from "antd";
import React from "react";
import { Call } from "src/typings/Call";
import { MemberType } from "src/typings/Common";
import { CallTimelineItem } from "./CallTimelineItem";

interface Props {
  calls: Call[];
  type: MemberType;
  navigate: (path: string) => void;
}

const CallTimeline: React.FC<Props> = ({ calls, type, navigate }) => {
  return (
    <Card title="Call Activity">
      {!calls.length && <Empty description="No Calls" />}
      <Timeline mode={"left"}>
        {calls.map((call) => (
          <CallTimelineItem
            key={call.id}
            call={call}
            type={type}
            navigate={navigate}
          />
        ))}
      </Timeline>
    </Card>
  );
};

export default CallTimeline;
