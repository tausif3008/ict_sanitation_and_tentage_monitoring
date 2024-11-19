import React from "react";
import { useSelector } from "react-redux";

const ParkingSelector = () => {
  const parkingData = useSelector((state) => state?.parkingSlice.name);
  const loading = useSelector((state) => state?.parkingSlice.loading);

  const parkingDrop = parkingData?.data?.parkings?.map((data) => {
    return {
      value: data?.parking_id,
      label: data?.name,
    };
  });

  return { parkingData, loading, parkingDrop };
};

export default ParkingSelector;
