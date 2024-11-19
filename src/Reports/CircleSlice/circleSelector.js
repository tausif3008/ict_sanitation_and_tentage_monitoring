import React from "react";
import { useSelector } from "react-redux";

const CircleSelector = () => {
  const AllCircleData = useSelector((state) => state?.circleWiseSlice.name);
  const loading = useSelector((state) => state?.circleWiseSlice.loading);

  const CircleListDrop = AllCircleData?.data?.circles?.map((data) => {
    return {
      value: data?.circle_id,
      label: data?.name,
    };
  });

  return { AllCircleData, loading, CircleListDrop };
};

export default CircleSelector;
