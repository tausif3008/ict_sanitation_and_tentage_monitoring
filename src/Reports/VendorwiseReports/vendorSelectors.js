import React from "react";
import { useSelector } from "react-redux";

const VendorSelectors = () => {
  const vendorReports = useSelector((state) => state?.vendorWiseSlice.name);
  const loading = useSelector((state) => state?.vendorWiseSlice.loading);
  return { vendorReports, loading };
};

export default VendorSelectors;
