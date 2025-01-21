import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const SectorReportSelectors = () => {
  const SectorReports = useSelector((state) => state?.SectorReportSlice.name);
  const SectorReport_Loading = useSelector(
    (state) => state?.SectorReportSlice.loading
  );

  const sectorData = useMemo(() => {
    return (
      SectorReports?.data?.sectors?.map((item) => ({
        ...item,
        total: Number(item?.total),
        registered: Number(item?.registered),
        clean: Number(item?.clean),
        unclean: Number(item?.unclean),
      })) || []
    );
  }, [SectorReports]);

  const SectorRegReport_data = useSelector(
    (state) => state?.SectorReportSlice.sector_data
  ); // Sector Wise Report data

  return {
    SectorReports,
    SectorReport_Loading,
    sectorData,
    SectorRegReport_data,
  };
};

export default SectorReportSelectors;
