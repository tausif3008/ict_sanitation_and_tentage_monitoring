import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const MonitoringSelector = () => {
  const monitoringAgentData = useSelector(
    (state) => state?.monitoringSlice.name
  ); // monitoring agent
  const loading = useSelector((state) => state?.monitoringSlice.loading);
  const DailyReport = useSelector(
    (state) => state?.monitoringSlice.daily_report
  );

  const monitoringAgentDrop = useMemo(() => {
    return monitoringAgentData?.data?.users?.map((data) => {
      return {
        value: data?.user_id,
        label: data?.name,
      };
    });
  }, [monitoringAgentData]); // monitoring agent dropdown

  return { monitoringAgentData, loading, monitoringAgentDrop, DailyReport };
};

export default MonitoringSelector;
