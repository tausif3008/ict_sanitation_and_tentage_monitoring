import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const VendorSupervisorSelector = () => {
  const loading = useSelector((state) => state?.vendorSupervisorSlice.loading);
  const ShiftData = useSelector((state) => state?.vendorSupervisorSlice.name);
  const VendorList = useSelector(
    (state) => state?.vendorSupervisorSlice.vendor_list
  );
  const AssetTypeVendorList = useSelector(
    (state) => state?.vendorSupervisorSlice.type_vendor_list
  );

  // vendor list
  const VendorListDrop = useMemo(() => {
    return (
      VendorList?.data?.users?.map((data) => ({
        value: data?.user_id,
        label: data?.name,
      })) || []
    );
  }, [VendorList]);

  // asset type wise vendor list
  const AssetTypeVendorDrop = useMemo(() => {
    return (
      AssetTypeVendorList?.data?.userdetails?.map((data) => ({
        value: data?.user_id,
        label: data?.user_name,
      })) || []
    );
  }, [AssetTypeVendorList]);

  return {
    ShiftData,
    loading,
    VendorList,
    VendorListDrop,
    AssetTypeVendorDrop,
  };
};

export default VendorSupervisorSelector;
