import { Card } from "antd";
import React, { ReactElement } from "react";
import { Doughnut } from "react-chartjs-2";
import { CONTAINER_BORDER_RADIUS } from "src/styles/styles";

interface Props {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
}
export default function DonutChart({
  title,
  labels,
  data,
  backgroundColor,
  hoverBackgroundColor,
}: Props): ReactElement {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        hoverBackgroundColor,
      },
    ],
  };

  return (
    <Card title={title} style={CONTAINER_BORDER_RADIUS}>
      <Doughnut data={chartData} />
    </Card>
  );
}
