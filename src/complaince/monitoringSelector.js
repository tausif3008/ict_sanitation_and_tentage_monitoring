import React from "react";
import { useSelector } from "react-redux";

const MonitoringSelector = () => {
  const monitoringAgentData = useSelector(
    (state) => state?.monitoringSlice.name
  ); // monitoring agent
  const loading = useSelector((state) => state?.monitoringSlice.loading);

  const monitoringAgentDrop = monitoringAgentData?.data?.users?.map((data) => {
    return {
      value: data?.user_id,
      label: data?.name,
    };
  });

  return { monitoringAgentData, loading, monitoringAgentDrop };
};

export default MonitoringSelector;
