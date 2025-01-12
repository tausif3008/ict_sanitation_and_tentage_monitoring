import React from "react";
import { useSelector } from "react-redux";

const GSDMonitoringSelector = () => {
  const GSDMonitoring_data = useSelector(
    (state) => state?.GsdWiseMonitoringReport.name
  ); // GSD Wise Monitoring data
  const gsd_monitoringLoader = useSelector(
    (state) => state?.GsdWiseMonitoringReport.loading
  );

  return { GSDMonitoring_data, gsd_monitoringLoader };
};

export default GSDMonitoringSelector;
