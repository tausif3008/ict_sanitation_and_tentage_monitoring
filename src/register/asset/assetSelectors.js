import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const ToiletAndTentageSelector = () => {
  const AssetExcel_data = useSelector((state) => state?.assetsSlice.name);
  const loading = useSelector((state) => state?.assetsSlice.loading);
  const AssetAllocateData = useSelector(
    (state) => state?.assetsSlice.allocate_data
  );
  const AssetViewData = useSelector((state) => state?.assetsSlice.view_data);

  const AssetUnitList = useMemo(() => {
    return AssetViewData?.data?.asset?.[0]?.units?.map((data) => {
      return {
        value: data?.unit_no,
        label: data?.unit_code,
      };
    });
  }, [AssetViewData]);

  return {
    AssetExcel_data,
    loading,
    AssetAllocateData,
    AssetViewData,
    AssetUnitList,
  };
};

export default ToiletAndTentageSelector;
