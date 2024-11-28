import React from "react";
import { useSelector } from "react-redux";

const InspectionReportSelector = () => {
  const InspectionReport_data = useSelector(
    (state) => state?.InspectionReportSlice.name
  );
  const loading = useSelector((state) => state?.InspectionReportSlice.loading);

  return { InspectionReport_data, loading };
};

export default InspectionReportSelector;
