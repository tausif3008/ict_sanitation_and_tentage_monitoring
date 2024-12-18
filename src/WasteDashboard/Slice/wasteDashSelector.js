import React from "react";
import { useSelector } from "react-redux";

const WasteDashSelector = () => {
  const loading = useSelector((state) => state?.wasteDashboardSlice.loading);
  const wasteDash_data = useSelector(
    (state) => state?.wasteDashboardSlice.name
  ); // waste dashboard

  return { wasteDash_data, loading };
};

export default WasteDashSelector;
