import React from "react";
import { useSelector } from "react-redux";

const VendorSupervisorSelector = () => {
  const ShiftData = useSelector((state) => state?.vendorSupervisorSlice.name);
  const VendorList = useSelector(
    (state) => state?.vendorSupervisorSlice.vendor_list
  );
  const loading = useSelector((state) => state?.vendorSupervisorSlice.loading);

  const VendorListDrop = VendorList?.data?.users?.map((data) => {
    return {
      value: data?.user_id,
      label: data?.name,
    };
  });

  return { ShiftData, loading, VendorList, VendorListDrop };
};

export default VendorSupervisorSelector;
