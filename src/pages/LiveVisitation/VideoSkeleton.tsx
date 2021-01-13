import React, { ReactElement } from "react";
import { Badge, Card } from "antd";
import "./Video.css";

interface Props {
  width: number | string;
  height: number | string;
}

export default function VideoSkeleton({ width, height }: Props): ReactElement {
  return (
    <Badge.Ribbon text="Offline">
      <Card style={{ width, height }} className="video-wrapper"></Card>
    </Badge.Ribbon>
  );
}
