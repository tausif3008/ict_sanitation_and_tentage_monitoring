import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const ParkingSelector = () => {
  const parkingData = useSelector((state) => state?.parkingSlice.name);
  const loading = useSelector((state) => state?.parkingSlice.loading);
  const parkingReportData = useSelector(
    (state) => state?.parkingSlice.report_data
  );

  const ParkingsData = useMemo(() => {
    return (
      parkingReportData?.data?.parkings?.map((item) => ({
        ...item,
        total: Number(item?.total),
        registered: Number(item?.registered),
        clean: Number(item?.clean),
        unclean: Number(item?.unclean),
      })) || []
    );
  }, [parkingReportData]);

  const parkingDrop = useMemo(() => {
    return parkingData?.data?.parkings?.map((data) => {
      return (
        {
          value: data?.parking_id,
          label: data?.name,
        } || []
      );
    });
  }, [parkingData]);

  return { parkingData, loading, parkingDrop, parkingReportData, ParkingsData };
};

export default ParkingSelector;
