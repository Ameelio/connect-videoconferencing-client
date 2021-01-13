import React, { ReactElement } from "react";
import { Badge, Card } from "antd";

interface Props {
  width: number | string;
  height: number | string;
}

export default function VideoSkeleton({ width, height }: Props): ReactElement {
  return (
    <Badge.Ribbon text="Offline">
      <Card
        style={{ width, height, backgroundColor: "#1f1f23", borderRadius: 8 }}
      ></Card>
    </Badge.Ribbon>
  );
}
