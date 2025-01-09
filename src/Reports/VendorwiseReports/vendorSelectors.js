import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const VendorSelectors = () => {
  const loading = useSelector((state) => state?.vendorWiseSlice.loading);
  const vendorReports = useSelector((state) => state?.vendorWiseSlice.name);
  const VendorCatTypeData = useSelector(
    (state) => state?.vendorWiseSlice.vendor_data
  );

  const VendorCatTypeDrop = useMemo(() => {
    return (
      VendorCatTypeData?.data?.userdetails?.map((item) => ({
        value: item?.user_id,
        label: item?.user_name,
      })) || []
    );
  }, [VendorCatTypeData]);

  return { vendorReports, loading, VendorCatTypeDrop };
};

export default VendorSelectors;
