import React from "react";
import { useSelector } from "react-redux";

const VehicleSelectors = () => {
  const VehicleData = useSelector((state) => state?.vehicleSlice.vehicle_list);
  const loading = useSelector((state) => state?.vehicleSlice.loading);

  return {
    VehicleData,
    loading,
  };
};

export default VehicleSelectors;
