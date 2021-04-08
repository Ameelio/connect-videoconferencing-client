import React from "react";
import { selectTotalInmates } from "src/redux/selectors";
import { useAppSelector } from "src/redux";
import Dashboard from "src/components/Dashboard";
import { useCalls } from "src/hooks/useCalls";

const DashboardPage: React.FC = () => {
  const calls = useCalls();
  const numIncPeople = useAppSelector(selectTotalInmates);
  const facility = useAppSelector((state) => state.facilities.selected);

  if (!facility) return <div />;

  return <Dashboard calls={calls} numIncPeople={numIncPeople} />;
};

export default DashboardPage;
