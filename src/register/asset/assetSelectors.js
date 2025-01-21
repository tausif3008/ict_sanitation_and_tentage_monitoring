import React from "react";
import { useSelector } from "react-redux";

const ToiletAndTentageSelector = () => {
  const AssetExcel_data = useSelector((state) => state?.assetsSlice.name);
  const loading = useSelector((state) => state?.assetsSlice.loading);
  const AssetAllocateData = useSelector(
    (state) => state?.assetsSlice.allocate_data
  );

  return { AssetExcel_data, loading, AssetAllocateData };
};

export default ToiletAndTentageSelector;
