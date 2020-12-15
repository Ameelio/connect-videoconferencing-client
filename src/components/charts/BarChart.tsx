import React, { ReactElement } from "react";
import { Doughnut } from "react-chartjs-2";

export default function BarChart(): ReactElement {
  const data = {
    labels: ["Extremely Poor", "Poor", "Okay", "Good", "Really Good"],
    datasets: [
      {
        data: [10, 30, 50, 100, 200],
        backgroundColor: [
          "#eef6ff",
          "#9ac1ec",
          "#70a9e9",
          "#0275D8",
          "#004886",
        ],
        hoverBackgroundColor: [
          "#eef6ff",
          "#9ac1ec",
          "#70a9e9",
          "#0275D8",
          "#004886",
        ],
      },
    ],
  };

  return (
    <div>
      <span className="p3 font-weight-bold">User Ratings Breakdown</span>
      <Doughnut data={data} />
    </div>
  );
}
