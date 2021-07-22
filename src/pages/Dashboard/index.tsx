import React, { useState } from "react";
import { selectTotalInmates } from "src/redux/selectors";
import { useAppDispatch, useAppSelector } from "src/redux";
import Dashboard from "src/components/Dashboard";
import { useCalls } from "src/hooks/useCalls";
import { fetchCalls } from "src/redux/modules/call";
import { endOfMonth, startOfMonth } from "date-fns";

const DashboardPage: React.FC = () => {
  const calls = useCalls();
  const totalInmates = useAppSelector(selectTotalInmates);
  const facility = useAppSelector((state) => state.facilities.selected);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  const refresh = () => {
    setIsRefreshing(true);
    dispatch(
      fetchCalls({
        scheduledStart: {
          rangeStart: startOfMonth(new Date()).getTime(),
          rangeEnd: endOfMonth(new Date()).getTime(),
        },
      })
    );
    setLastUpdatedAt(new Date());
    setIsRefreshing(false);
  };

  if (!facility) return <div />;

  return (
    <Dashboard
      calls={calls}
      totalInmates={totalInmates}
      facilityName={facility.name}
      lastUpdatedAt={lastUpdatedAt}
      refresh={refresh}
      isRefreshing={isRefreshing}
    />
  );
};

export default DashboardPage;
