import React from "react";
import { useSelector } from "react-redux";

const ConfigSettingSelector = () => {
  const ConfigSettingData = useSelector((state) => state?.configSlice.name);
  const loading = useSelector((state) => state?.configSlice.loading);

  return {
    ConfigSettingData,
    loading,
  };
};

export default ConfigSettingSelector;
