import React from "react";
import { useSelector } from "react-redux";

const IncidentReportSelector = () => {
  const IncidentReport_data = useSelector(
    (state) => state?.IncidentReportSlice.name
  );
  const loading = useSelector((state) => state?.IncidentReportSlice.loading);
  const AssetUnitData = useSelector(
    (state) => state?.IncidentReportSlice.unit_data
  );

  return { IncidentReport_data, loading, AssetUnitData };
};

export default IncidentReportSelector;
