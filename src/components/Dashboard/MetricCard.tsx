import { Card, Statistic } from "antd";
import React, { ReactElement } from "react";

interface Props {
  title: string;
  value: string | number;
  suffix: string;
  prefix: JSX.Element;
}

export default function MetricCard({
  title,
  value,
  suffix,
  prefix,
}: Props): ReactElement {
  return (
    <Card>
      <Statistic title={title} value={value} prefix={prefix} suffix={suffix} />
    </Card>
  );
}
