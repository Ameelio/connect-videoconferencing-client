import { Card } from "antd";
import React from "react";
import { Line } from "react-chartjs-2";

const COLOR = "rgba(0, 137, 255, 1)";
const BG = "rgba(0, 137, 255, 0.4)";
const DARKER_COLOR = "rgba(2, 117, 216, 1)";

interface Props {
  title: string;
  labels: string[];
  label: string;
  data: number[];
}

const LineChart: React.FC<Props> = ({ title, label, labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        lineTension: 0.1,
        backgroundColor: BG,
        borderColor: COLOR,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: COLOR,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: COLOR,
        pointHoverBorderColor: DARKER_COLOR,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data,
      },
    ],
  };

  return (
    <Card title={title}>
      <Line data={chartData} />
    </Card>
  );
};

export default LineChart;
