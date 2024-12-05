import React from "react";
import { useSelector } from "react-redux";

const ToiletAndTentageSelector = () => {
  const AssetExcel_data = useSelector((state) => state?.assetsSlice.name);
  const loading = useSelector((state) => state?.assetsSlice.loading);

  return { AssetExcel_data, loading };
};

export default ToiletAndTentageSelector;
