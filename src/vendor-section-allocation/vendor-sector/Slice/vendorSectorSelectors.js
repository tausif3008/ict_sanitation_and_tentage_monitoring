import React, { useMemo } from "react";
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
  const SectorListDrop = useMemo(() => {
    return (
      SectorData?.data?.sectors?.map(({ sector_id, name }) => ({
        value: sector_id,
        label: name,
      })) || []
    );
  }, [SectorData]);

  const SuperwiseListDrop = useMemo(() => {
    return (
      SuperwiseList?.data?.users?.map(({ user_id, name }) => ({
        value: user_id,
        label: name,
      })) || []
    );
  }, [SuperwiseList]);

  const UsersDropTypeWise = useMemo(() => {
    return (
      TypeUserList?.data?.users?.map(({ user_id, name }) => ({
        value: user_id,
        label: name,
      })) || []
    );
  }, [TypeUserList]);

  return {
    SectorData,
    loading,
    SectorListDrop,
    SuperwiseListDrop,
    UsersDropTypeWise,
  };
};

export default VendorSectorSelectors;
