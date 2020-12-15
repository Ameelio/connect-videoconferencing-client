import React, { ReactElement } from "react";
import "./MetricCard.css";
import { ArrowUpRight, ArrowDownRight } from "react-feather";

interface Props {
  name: string;
  metric: number;
  label?: string;
  growthRate?: number;
}

export default function MetricCard({
  label,
  metric,
  name,
  growthRate,
}: Props): ReactElement {
  const growthColor = growthRate && growthRate > 0 ? "green" : "red";
  const bgColor = growthRate && growthRate > 0 ? "lightgreen" : "lightred";
  const growthIcon: JSX.Element =
    growthRate && growthRate > 0 ? (
      <ArrowUpRight className={growthColor} size={20} />
    ) : (
      <ArrowDownRight className={growthColor} size={20} />
    );

  return (
    <div className="d-flex flex-row metric-card align-items-center">
      <div className="d-flex flex-column">
        <span className="black-400 p4">{name}</span>
        <div className="d-flex flex-row align-items-center">
          <span className="p1 font-weight-bold">{metric}</span>
          <span className="ml-2">{label}</span>
        </div>
        {growthRate && (
          <div className="d-flex flex-row align-items-center">
            <div className={`${bgColor}-bg span-circle `}>{growthIcon}</div>
            <span className={`${growthColor} ml--3`}>
              {(growthRate * 100).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
      {/* <div className="span-circle-large lightgreen-bg green flex-shrink-0">
        <Clock size="24" />{" "}
      </div> */}
    </div>
  );
}
