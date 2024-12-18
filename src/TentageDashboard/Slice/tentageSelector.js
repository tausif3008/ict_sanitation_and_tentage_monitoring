import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const TentageSelector = () => {
  const TentageDash_data = useSelector((state) => state?.tentageSlice.name); // sanitation dashboard
  const loading = useSelector((state) => state?.tentageSlice.loading);

  return { TentageDash_data, loading };
};

export default TentageSelector;
