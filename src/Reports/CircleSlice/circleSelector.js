import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const CircleSelector = () => {
  const AllCircleData = useSelector((state) => state?.circleWiseSlice.name);
  const loading = useSelector((state) => state?.circleWiseSlice.loading);
  const CircleReports = useSelector(
    (state) => state?.circleWiseSlice.report_data
  );

  // All circle dropdown
  const CircleListDrop = useMemo(() => {
    return (
      AllCircleData?.data?.circles?.map((data) => {
        return {
          value: data?.circle_id,
          label: data?.name,
        };
      }) || []
    );
  }, [AllCircleData]);

  return { AllCircleData, CircleReports, loading, CircleListDrop };
};

export default CircleSelector;
