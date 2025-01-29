import React from "react";
import { useSelector } from "react-redux";

const IncidentReportSelector = () => {
  const IncidentReport_data = useSelector(
    (state) => state?.IncidentReportSlice.name
  );
  const loading = useSelector((state) => state?.IncidentReportSlice.loading);
  const AssetIncidentData = useSelector(
    (state) => state?.IncidentReportSlice.incident_data
  );

  return { IncidentReport_data, loading, AssetIncidentData };
};

export default IncidentReportSelector;
