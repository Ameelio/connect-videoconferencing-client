import React, { ReactElement } from "react";
import MetricCard from "src/components/cards/MetricCard";
import Container from "src/components/containers/Container";
import LineChart from "src/components/charts/LineChart";
import BarChart from "src/components/charts/BarChart";

interface Props {}

export default function Dashboard({}: Props): ReactElement {
  return (
    <div>
      <div className="d-flex flex-column">
        <span className="p2 facility-name mt-3">State Penitentiary</span>
      </div>
      <div className="d-flex flex-row">
        <Container rounded>
          <MetricCard
            name="Average call duration"
            metric={22}
            growthRate={-0.0696}
            label="min"
          />
        </Container>
        <Container rounded>
          <MetricCard
            name="Calls this week"
            metric={34}
            growthRate={-0.0321}
            label="calls"
          />
        </Container>
        <Container rounded>
          <MetricCard
            name="Inmate usage"
            metric={79}
            label={"%"}
            growthRate={0.1641}
          />
        </Container>
        <Container rounded>
          <MetricCard
            name="Average call rating"
            metric={4.1}
            label={"/5.0"}
            growthRate={0.1213}
          />
        </Container>
      </div>
      <div className="d-flex flex-row">
        <Container rounded fluid>
          <LineChart />
        </Container>

        <Container rounded fluid>
          <BarChart />
        </Container>
      </div>
    </div>
  );
}
