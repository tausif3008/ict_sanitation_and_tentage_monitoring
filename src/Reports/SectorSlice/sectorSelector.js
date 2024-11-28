import React from "react";
import { useSelector } from "react-redux";

const SectorReportSelectors = () => {
  const SectorReports = useSelector((state) => state?.SectorReportSlice.name);
  const loading = useSelector((state) => state?.SectorReportSlice.loading);
  return { SectorReports, loading };
};

export default SectorReportSelectors;
