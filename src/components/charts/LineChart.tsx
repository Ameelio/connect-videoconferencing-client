import React from "react";
import { Line } from "react-chartjs-2";

const COLOR = "rgba(0, 137, 255, 1)";
const BG = "rgba(0, 137, 255, 0.4)";
const DARKER_COLOR = "rgba(2, 117, 216, 1)";

interface Props {}

const LineChart: React.FC<Props> = () => {
  const data = {
    labels: ["March", "April", "May", "June", "July", "August"],
    datasets: [
      {
        label: "# of Visitations",
        fill: false,
        lineTension: 0.1,
        backgroundColor: BG,
        borderColor: COLOR,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: COLOR,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: COLOR,
        pointHoverBorderColor: DARKER_COLOR,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  return (
    <div>
      <span className="p3 font-weight-bold">Visitations</span>
      <Line data={data} />
    </div>
  );
};

export default LineChart;
