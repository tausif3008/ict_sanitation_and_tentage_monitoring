import React from "react";
import { useSelector } from "react-redux";

const GsdRegistrationSelector = () => {
  const GSDReport_data = useSelector(
    (state) => state?.GsdWiseRegistrationReport.name
  ); // GSD Wise Report data
  const VendorReport_data = useSelector(
    (state) => state?.GsdWiseRegistrationReport.vendor_data
  ); // Vendor Wise Report data
  const loading = useSelector(
    (state) => state?.GsdWiseRegistrationReport.loading
  );

  return { GSDReport_data, loading, VendorReport_data };
};

export default GsdRegistrationSelector;
