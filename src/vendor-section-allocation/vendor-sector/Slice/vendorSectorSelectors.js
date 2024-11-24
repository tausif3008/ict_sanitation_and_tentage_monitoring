import React from "react";
import { useSelector } from "react-redux";

const VendorSectorSelectors = () => {
  const SectorData = useSelector(
    (state) => state?.vendorSectorSlice.sector_list
  ); // all sector data
  const SuperwiseList = useSelector((state) => state?.vendorSectorSlice.name);
  const loading = useSelector((state) => state?.vendorSectorSlice.loading);
  const TypeUserList = useSelector(
    (state) => state?.vendorSectorSlice.user_list
  );
  // all sector list dropdown
  const SectorListDrop = SectorData?.data?.sectors?.map((data) => {
    return {
      value: data?.sector_id,
      label: data?.name,
    };
  });
  const SuperwiseListDrop = SuperwiseList?.data?.users?.map((data) => {
    return {
      value: data?.user_id,
      label: data?.name,
    };
  });

  const UsersDropTypeWise = TypeUserList?.data?.users?.map((data) => {
    return {
      value: data?.user_id,
      label: data?.name,
    };
  });

  return {
    SectorData,
    loading,
    SectorListDrop,
    SuperwiseListDrop,
    UsersDropTypeWise,
  };
};

export default VendorSectorSelectors;
