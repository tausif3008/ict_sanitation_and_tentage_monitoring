import React from "react";
import { useSelector } from "react-redux";

const VehicleReportSelector = () => {
  const VehicleReportData = useSelector((state) => state?.VehicleReport.name);
  const VehicleReportLoader = useSelector(
    (state) => state?.VehicleReport.loading
  );

  return { VehicleReportData, VehicleReportLoader };
};

export default VehicleReportSelector;
