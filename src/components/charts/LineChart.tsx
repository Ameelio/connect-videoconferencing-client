import React from "react";
import { Line } from "react-chartjs-2";

const COLOR = "rgba(0, 137, 255, 1)";
const BG = "rgba(0, 137, 255, 0.4)";
const DARKER_COLOR = "rgba(2, 117, 216, 1)";

interface Props {}

const LineChart: React.FC<Props> = () => {
  const data = {
    labels: ["July 6", "July 13", "July 20", "July 27", "Aug 3", "Aug 10"],
    datasets: [
      {
        label: "# of Visitations",
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
        data: [34, 59, 44, 72, 80, 90, 40],
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
