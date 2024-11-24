import React from "react";
import { useSelector } from "react-redux";

const IncidentReportSelector = () => {
  const IncidentReport_data = useSelector(
    (state) => state?.IncidentReportSlice.name
  ); // sanitation dashboard
  const loading = useSelector((state) => state?.IncidentReportSlice.loading);

  return { IncidentReport_data, loading };
};

export default IncidentReportSelector;
